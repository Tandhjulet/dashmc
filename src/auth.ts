import NextAuth, { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord" 

export const authConfig = {
	providers: [Google({
		profile(params) {
			return {
				email: params.email,
			}
		}
	}), Discord({
		profile(params) {
			return {
				email: params.email,
			}
		}
	})],
} satisfies NextAuthConfig 

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)