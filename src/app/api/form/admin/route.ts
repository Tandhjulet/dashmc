import { auth } from "@/auth";
import { Field, Form } from "@/lib/forms/Form";
import { Role } from "@prisma/client";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
	const { name, fields, subtitle, category }: {
		name: string,
		subtitle: string,
		fields?: Field[],
		category: string;
	} = await req.json();

	const session = await auth();
	if(session?.user?.role !== Role.ADMIN || !session.user.email) {
		return Response.json(
			{ success: false },
			{
				status: 401,
			}
		);
	}

	const form = new Form(name, subtitle, category);
	const couldAttach = await form.attachOwner({
		email: session.user.email
	});
	if(!couldAttach) {
		return Response.json(
			{success: false},
			{
				status: 500,
			}
		)
	}

	if(fields)
		form.fields = fields;
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