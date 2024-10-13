import { auth } from "@/auth";
import { Field } from "@/lib/forms/Field";
import { $Enums, Role } from "@prisma/client";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
	const {
		title,
		required,
		subtitle,
		type,
		formCuid,
	}: {
		title: string;
		required: boolean;
		subtitle: string;
		type: $Enums.FieldType;
		formCuid: string;
	} = await req.json();

	if(!title || !type || !formCuid) {
		return Response.json(
			{ success: false },
			{
				status: 400,
			}
		)
	}

	const session = await auth();
	if(session?.user?.role !== Role.ADMIN) {
		return Response.json(
			{ success: false },
			{
				status: 401,
			}
		);
	}

	const field = new Field(title, type, formCuid, subtitle, required);
	const savedField = await field.save();

	revalidateTag("specific_form");

	return Response.json({
		success: true,
		id: savedField?.id,
	})
}