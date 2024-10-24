import { auth } from "@/auth";
import { Submission } from "@/lib/forms/Submission";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
	const {
		cursor,
		backwards,
		filter,
	} = await req.json();
	
	const session = await auth();
	if(session?.user?.role !== Role.ADMIN) {
		return Response.json(
			{ success: false },
			{
				status: 401,
			}
		);
	}

	return Response.json({
		success: true,
		submissions: await Submission.getSubmissionsFromCursor(cursor, backwards, filter),
	})
}