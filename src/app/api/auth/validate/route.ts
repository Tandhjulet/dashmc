// app/api/auth/validate-session/route.ts
import { NextResponse } from "next/server";
import { auth, signOut } from "@/auth";
import { prisma } from "@/prisma/prisma";

const mapping = {
	discordId: "discordId",
	email: "email",
	username: "username",
	role: "role",
	gameUUID: "uuid",
};

export async function GET(req: Request) {
	const url = new URL(req.url);
	const redirectUrl =
		url.searchParams.get("redirect") ?? "/";

	const session = await auth();

	if (!session || !session.user) {
		return NextResponse.redirect(
			new URL("/login", url)
		);
	}

	const user = await prisma.user.findUnique({
		where: { id: session.user.dbId },
	});

	const allMatch = Object.entries(mapping).every(
		// @ts-expect-error As we are using mappings, the code would become unreadable if we don't ignore this.
		([key, key2]) => session.user[key2] === user[key]
	);

	if (!allMatch) {
		await signOut({ redirect: false });
		return NextResponse.redirect(
			new URL("/login", url)
		);
	}

	return NextResponse.redirect(new URL(redirectUrl, url));
}
