import NextAuth, { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord" 
import { prisma } from "./prisma/prisma"

export const authConfig = {
	providers: [Google({
		profile(params) {
			return {
				email: params.email,
			}
		},
	}), Discord({
		profile(params) {
			return {
				email: params.email,
			}
		}
	})],
	callbacks: {
		async jwt({ token, user }) {
			if(!user?.email)
				return token;

			const persistedUserData = await prisma.user.findFirst({
				where: {
					email: { equals: user.email }
				}
			})
			token.username = persistedUserData?.username;
			return token;
		},
		async session({ session, token}) {
			if(session?.user) {
				session.user.username = token.username;
			}
			return session;
		}
	}
} satisfies NextAuthConfig 

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)