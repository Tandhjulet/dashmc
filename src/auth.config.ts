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
} satisfies NextAuthConfig
