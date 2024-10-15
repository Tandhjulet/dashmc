import { NextAuthConfig } from "next-auth";
import Discord from "next-auth/providers/discord";

export default {
	providers: [Discord({
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
