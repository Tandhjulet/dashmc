import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { $Enums } from "@prisma/client";
import { revalidateTag } from "next/cache";

export async function PUT(req: Request) {
	const {
		status,
		submissionId
	} = await req.json();

	if(!status || !submissionId || !Object.values($Enums.SubmissionStatus).includes(status)) {
		return Response.json(
			{ success: false },
			{
				status: 400,
			}
		)
	}

	const session = await auth();
	if(session?.user?.role !== "ADMIN") {
		return Response.json(
			{ success: false },
			{
				status: 401,
			}
		)
	}

	const deleted = await prisma.submission.update({
		where: {
			id: submissionId,
		},
		data: {
			status: status
		}
	});
	
	revalidateTag(`submission:${submissionId}`);
	revalidateTag(`user:${deleted.userId}`);

	return Response.json(
		{ success: true }
	)
}