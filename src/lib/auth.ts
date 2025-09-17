import { signOut } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { Role } from "@prisma/client";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

const mapping = {
	discordId: "discordId",
	email: "email",
	username: "username",
	role: "role",
};

export async function validateRole(
	session: JWT | User,
	requireRoles?: Role[]
): Promise<boolean> {
	const user = await prisma.user.findUniqueOrThrow({
		where: { id: session?.dbId },
	});

	const validRole =
		requireRoles &&
		user?.role &&
		requireRoles.includes(user.role);

	session.role = user.role;

	const allMatch = Object.entries(mapping).every(
		// @ts-expect-error As we are using mappings, the code would become unreadable if we don't ignore this.
		([key, key2]) => session[key2] === user[key]
	);

	if (!allMatch || !validRole) {
		await signOut({ redirect: false });
		return false;
	}

	return true;
}
