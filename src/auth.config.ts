import { NextAuthConfig } from "next-auth";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";

export default {
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
		async session({ session, token }) {
			session.user.username = token.username;
			session.user.uuid = token.uuid;
			session.user.role = token.role;
			return session;
		}
	}
} satisfies NextAuthConfig
