import NextAuth, { NextAuthConfig } from "next-auth"
import { prisma } from "./prisma/prisma"
import { client } from "./lib/redis"
import { OTPCode } from "./app/api/verify/code/route"
import authConfig from "./auth.config"

export const authOptions = {
	...authConfig,
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			if(trigger === "update") {
				const code: string = session.code;
				const uuid: string = session.uuid;
				
				// Verify input
				const associatedWith = await client.get(`otp:${code}`);

				if(!associatedWith)
					return token;
				const otpCode: OTPCode = JSON.parse(associatedWith)
				if(!otpCode.uuid || !otpCode.hasBeenVerified || otpCode.uuid !== uuid)
					return token;

				const persistedUserData = await prisma.user.findFirst({
					where: {
						gameUUID: { equals: otpCode.uuid }
					}
				})

				if(!persistedUserData) {
					return token;
				}

				token.username = persistedUserData?.username;
				token.uuid = persistedUserData?.gameUUID;
				token.role = persistedUserData.role;
				return token;
			}

			if(!user?.email)
				return token;

			const persistedUserData = await prisma.user.findFirst({
				where: {
					email: { equals: user.email }
				}
			})

			token.username = persistedUserData?.username;
			token.uuid = persistedUserData?.gameUUID;
			token.role = persistedUserData?.role;
			return token;
		},
		async session({ session, token }) {
			session.user.username = token.username;
			session.user.uuid = token.uuid;
			session.user.role = token.role;
			return session;
		}
	}
} satisfies NextAuthConfig 

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)