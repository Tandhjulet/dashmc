import { auth } from "@/auth";
import { Form } from "@/lib/forms/Form";
import { ISubmissionField } from "@/lib/forms/Submission";
import { prisma } from "@/prisma/prisma";
import { revalidateTag } from "next/cache";

function validate(form: Form, submission: {[id: number]: string}): false | ISubmissionField[] {
	const submissionKeys = Object.keys(submission);
	const fields: ISubmissionField[] = []

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
				answer: submission[field.id],
				required: field.required,
				subtitle: field.subtitle,
				title: field.title,
				type: field.type,
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
	if(!session?.user?.dbId) {
		return Response.json(
			{ success: false },
			{
				status: 401,
			}
		);
	}

	const user = await prisma.user.findUnique({
		where: {
			id: session.user.dbId,
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
	console.log(fields);
	if(fields === false || fields.length === 0)
		return Response.json(
			{ success: false },
			{
				status: 401,
			}
		);

	const submitted = await prisma.submission.create({
		data: {
			category: form.category,
			name: form.title,
			subtitle: form.subtitle,
			userId: user.id,
			status: "Waiting",
			fields: {
				createMany: {
					data: fields
				}
			}
		}
	})

	revalidateTag(`submission:${submitted.id}`);
	revalidateTag(`user:${user.id}`);

	return Response.json({
		success: true,
		id: submitted.id
	})
}

export async function DELETE(req: Request) {
	const {
		submissionId
	}: {
		submissionId: string,
	} = await req.json();

	if(!submissionId) {
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

	const deleteSubmission = prisma.submission.delete({
		where: {
			id: submissionId
		},
	})

	const deleteFields = prisma.submissionField.deleteMany({
		where: {
			submissionId: submissionId,
		}
	})

	const deleted = await prisma.$transaction([deleteFields, deleteSubmission]);

	revalidateTag(`submission:${submissionId}`);
	revalidateTag(`user:${deleted[1].userId}`);
	
	return Response.json(
		{success: true}
	)
}