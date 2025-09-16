import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { Role } from "@prisma/client";
import { revalidateTag } from "next/cache";

export async function PUT(req: Request) {
	const {
		userId,
		role,
	}: {
		userId: string;
		role: string;
	} = await req.json();

	const session = await auth();
	if (session?.user?.role !== Role.ADMIN) {
		return Response.json(
			{ success: false },
			{
				status: 401,
			}
		);
	}

	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			role: {
				set: role as Role,
			},
		},
	});

	revalidateTag(`user:${userId}`);

	return Response.json({
		success: true,
	});
}
