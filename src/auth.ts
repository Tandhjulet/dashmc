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
				if(!token.email)
					return token;

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
						gameUUID: otpCode.uuid,
						email: token.email,
					}
				})

				if(!persistedUserData) {
					return token;
				}

				token.discordId = persistedUserData.discordId ?? undefined;
				token.dbId = persistedUserData?.id;
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
			token.discordId = persistedUserData?.discordId ?? user.discordId;
			token.dbId = persistedUserData?.id;
			token.username = persistedUserData?.username;
			token.uuid = persistedUserData?.gameUUID;
			token.role = persistedUserData?.role;
			return token;
		},
		async session({ session, token }) {
			session.user.discordId = token.discordId;
			session.user.dbId = token.dbId;
			session.user.username = token.username;
			session.user.uuid = token.uuid;
			session.user.role = token.role;
			return session;
		},
		async signIn({ account, profile }) {
			if(account?.provider === "discord" && !profile?.verified) {
				return false;
			}
			return true;
		}
	},
	pages: {
		error: "/error"
	}
} satisfies NextAuthConfig 

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)