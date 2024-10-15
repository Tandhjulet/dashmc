import { auth } from "@/auth";
import { Form } from "@/lib/forms/Form";
import { Role } from "@prisma/client";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
	const { name, subtitle, category }: {
		name: string,
		subtitle: string,
		category: string;
	} = await req.json();

	if(!name || !subtitle || !category) {
		return Response.json(
			{success: false},
			{
				status: 400,
			}
		)
	}

	const session = await auth();
	if(session?.user?.role !== Role.ADMIN || !session.user.dbId) {
		return Response.json(
			{ success: false },
			{
				status: 401,
			}
		);
	}

	const form = new Form(name, subtitle, category);
	const couldAttach = await form.attachOwner({
		id: session.user.dbId
	});
	if(!couldAttach) {
		return Response.json(
			{success: false},
			{
				status: 500,
			}
		)
	}
	
	const id = await form.save();

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