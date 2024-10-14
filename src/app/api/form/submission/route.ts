import { auth } from "@/auth";
import { Form } from "@/lib/forms/Form";
import { prisma } from "@/prisma/prisma";

function validate(form: Form, submission: {[id: number]: string}): false | {answer: string, fieldId: number}[] {
	const submissionKeys = Object.keys(submission);
	const fields: {answer: string, fieldId: number}[] = []

	let i = 0;
	for(const field of form.fields) {
		if(field.type === "Section") {
			continue;
		}

		if(field.id.toString() != submissionKeys[i++]) {
			return false;
		} else if(field.type === "Radio") {
			const radioElements = field.subtitle?.split("\0\n*") ?? [];

			if(!(radioElements.includes(submission[field.id])) && submission[field.id] != "")
				return false;
		}

		if(submission[field.id] && submission[field.id] !== "")
			fields.push({
				fieldId: field.id,
				answer: submission[field.id],
			})
	}

	return fields;
}

export async function POST(req: Request) {
	const {
		formCuid,
		submission,
	}: {
		formCuid: string,
		submission: {[id: number]: string}
	} = await req.json();

	if(!formCuid || !submission) {
		return Response.json({ success: false }, {
			status: 400,
		})
	}

	const session = await auth();
	if(!session?.user?.email) {
		return Response.json(
			{ success: false },
			{
				status: 401,
			}
		);
	}

	const user = await prisma.user.findUnique({
		where: {
			email: session.user.email,
		}
	});
	if(!user) {
		return Response.json(
			{ success: false },
			{
				status: 401,
			}
		);
	}


	const form = await Form.fromId(formCuid);
	if(!form) {
		return Response.json(
			{ success: false },
			{
				status: 400,
			}
		)
	}

	const fields = validate(form, submission);
	if(fields === false || fields.length === 0)
		return Response.json(
			{ success: false },
			{
				status: 401,
			}
		);

	const submitted = await prisma.submission.create({
		data: {
			formId: formCuid,
			userId: user.id,
			fields: {
				createMany: {
					data: fields
				}
			}
		}
	})

	return Response.json({
		success: true,
		id: submitted.id
	})
}