/* eslint-disable @typescript-eslint/no-unused-vars */
import { DefaultUser } from 'next-auth';
declare module 'next-auth' {
    interface DefaultSession {
        user?: DefaultUser & { username?: string, uuid?: string };
    }
    interface User extends DefaultUser {
        username?: string;
		uuid?: string;
    }
}

import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
	interface JWT {
		username?: string;
		uuid?: string;
	}
}