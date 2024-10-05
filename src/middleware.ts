import NextAuth from "next-auth";
import { authConfig } from "./auth";

const { auth } = NextAuth(authConfig);

const PROTECTED: string[] = ["/test"];

export default auth((req) => {
	const { nextUrl } = req;

	const isAuth = !!req.auth;

	const isProtected = PROTECTED.includes(nextUrl.pathname);

	if(!isAuth && isProtected) {
		return Response.redirect(new URL("/login", req.url));
	} else if(isAuth && isProtected && !req?.auth?.user?.username) {
		return Response.redirect(
				new URL("/verify?prevUrl=" + encodeURIComponent(nextUrl.pathname), req.url)
			);
	}
})

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|icon.ico|manifest.webmanifest).*)'],
};