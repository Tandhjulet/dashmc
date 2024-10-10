import { auth } from "@/auth";
import { Field, Form } from "@/lib/forms/Form";
import { Role } from "@prisma/client";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
	const { name, fields, category }: {
		name: string,
		fields?: Field[],
		category: string;
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

	const form = new Form(name, category, fields);
	const id = form.save();

	revalidateTag("form");

	return Response.json({
		success: !!id,
		id,
	});
}

export async function DELETE(req: Request) {
	const { id } = await req.json();

	const session = await auth();
	if(session?.user?.role !== Role.ADMIN) {
		return Response.json(
			{success: false},
			{
				status: 401,
			}
		)
	}

	const success = await Form.delete(id);

	revalidateTag("form");

	return Response.json({
		success,
	})
}