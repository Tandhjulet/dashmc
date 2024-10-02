import NextAuth from "next-auth";
import { authConfig } from "./auth";

const { auth } = NextAuth(authConfig);

const PROTECTED: {[id: string]: string} = {
	"/verify": "/login",
}

export default auth((req) => {
	const { nextUrl } = req;

	const isAuth = !!req.auth;

	if(!isAuth && PROTECTED[nextUrl.pathname]) {
		return Response.redirect(new URL(PROTECTED[nextUrl.pathname], req.url));
	}
})

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|icon.ico|manifest.webmanifest).*)'],
};