import NextAuth from "next-auth";
import authConfig from "./auth.config";

if(!process.env.OTP_VERIFICATION_TOKEN) {
	throw new Error("OTP_VERIFICATION_TOKEN not present in env file!")
}

const { auth } = NextAuth(authConfig);

const PROTECTED: string = '/(dashboard|apply).*';

export default auth(async (req) => {
	const { nextUrl } = req;

	const isAuth = !!req.auth;

	const isProtected = nextUrl.pathname.match(PROTECTED);
	if(!isAuth && isProtected) {
		return Response.redirect(new URL("/login", req.url));
	} else if(isAuth && isProtected && !req?.auth?.user?.username) {
		return Response.redirect(
				new URL("/verify?prevUrl=" + encodeURIComponent(nextUrl.pathname), req.url)
			);
	}

	const isApiRoute = nextUrl.pathname.startsWith("/api");
	if(isApiRoute) {
		const headers = new Headers(req.headers);

		let authHeader = headers.get("Authorization");
		if(authHeader?.startsWith("Bearer ")) {
			authHeader = authHeader.substring("Bearer ".length);
		}

		// Only trusted parties should be able to verify codes.
		// Let's check if authorization is valid.
		if((req.method === "PUT" &&
			nextUrl.pathname.startsWith("/api/verify/code") &&
			authHeader !== process.env.OTP_VERIFICATION_TOKEN
		)) {
			return Response.json({
				message: "Incorrect authorization supplied."
			}, { status: 401 })
		}
	}

	if(nextUrl.pathname.startsWith("/apply/admin")) {
		if(req.auth?.user?.role !== "ADMIN")
			Response.json({
				message: "Insufficient authorization supplied."
			}, { status: 401 });
	}
})

export const config = {
	matcher: ['/((?!_next/static|_next/image|icon.ico|manifest.webmanifest).*)'],
};