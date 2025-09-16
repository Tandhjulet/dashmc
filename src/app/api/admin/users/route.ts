import { auth } from "@/auth";
import { Submission } from "@/lib/forms/Submission";
import { prisma } from "@/prisma/prisma";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
	const { cursor, backwards, filter } = await req.json();

	const session = await auth();
	if (session?.user?.role !== Role.ADMIN) {
		return Response.json(
			{ success: false },
			{
				status: 401,
			}
		);
	}

	return Response.json({
		success: true,
		users: await prisma.user.findMany({
			// arbitrary page size
			take: backwards
				? -Submission.PAGE_SIZE
				: Submission.PAGE_SIZE,
			// skip one so the next set doesnt include previous
			skip: cursor ? 1 : 0,

			cursor: cursor ? { id: cursor } : undefined,
			orderBy: {
				createdAt: "desc",
			},
			where: filter,
		}),
	});
}
