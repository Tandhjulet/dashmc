import { auth } from "@/auth";
import { Form } from "@/lib/forms/Form";
import { Role } from "@prisma/client";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
	const { name, subtitle, category, visible, selectedIcon }: {
		name: string,
		subtitle: string,
		category: string,
		visible: boolean,
		selectedIcon: string,
	} = await req.json();

	if(!name || !subtitle || !category || !selectedIcon) {
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
	form.visible = visible;
	form.icon = selectedIcon;
	
	const id = await form.save();

	revalidateTag('form');

	return Response.json({
		success: !!id,
		id,
	});
}

export async function PUT(req: Request) {
	const { name, subtitle, category, visible, selectedIcon, formId }: {
		name: string,
		subtitle: string,
		category: string,
		visible: boolean,
		selectedIcon: string,
		formId: string,
	} = await req.json();

	if(!name || !subtitle || !category || !selectedIcon || !formId) {
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

	const form = await Form.fromId(formId);
	if(!form) {
		return Response.json(
			{success: false},
			{
				status: 400,
			}
		)
	}
	form.name = name;
	form.category = category;
	form.subtitle = subtitle;

	form.visible = visible;
	form.icon = selectedIcon;
	
	const id = await form.save();

	revalidateTag('form');
	revalidateTag(`form:${id}`);

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

	revalidateTag('form');
	revalidateTag(`form:${id}`)

	return Response.json({
		success,
	})
}