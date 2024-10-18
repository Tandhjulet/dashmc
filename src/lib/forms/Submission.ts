import { prisma } from "@/prisma/prisma";
import { FieldWithId, IField } from "./Field";
import { $Enums, Prisma, User } from "@prisma/client";

export interface ISubmissionField extends IField {
	answer: string;
}

export interface ISubmission {
	id?: string;
	createdAt?: Date;

	name: string;
	subtitle: string;
	category: string;

	user?: User;
	userId?: string;

	fields: FieldWithId<ISubmissionField>[];

	status: $Enums.SubmissionStatus;
}

export class Submission {
	private id?: string;
	private _createdAt?: Date;

	private _status: $Enums.SubmissionStatus = "Waiting";

	private user?: User;
	private userId?: string;

	private _category: string;
	private _name: string;
	private _subtitle: string;

	private _fields: FieldWithId<ISubmissionField>[] = [];
	private _virtual: boolean = true;

	static PAGE_SIZE = 20;

	static async getSubmissionsFromCursor(cursor?: string, backwards?: boolean, filter?: Prisma.SubmissionWhereInput) {
		return await prisma.submission.findMany({
			// arbitrary page size
			take: backwards ? -Submission.PAGE_SIZE : Submission.PAGE_SIZE,
			// skip one so the next set doesnt include previous
			skip: cursor ? 1 : 0,

			cursor: cursor ? { id: cursor } : undefined,
			orderBy: {
				createdAt: "desc",
			},
			where: filter,

			include: {
				user: true,
			}
		})
	}

	static async getAllSubmissions(where?: Prisma.SubmissionWhereInput) {
		return await prisma.submission.findMany({
			where,
			include: {
				fields: false,
				user: true,
			}
		});
	}

	static async fromId(cuid: string) {
		const persistedSubmission = await prisma.submission.findUnique({
			where: {
				id: cuid,
			},
			include: {
				fields: true,
				user: true,
			}
		});

		if(!persistedSubmission)
			return false;
		const submission = new Submission(persistedSubmission.category, persistedSubmission.name, persistedSubmission.subtitle);
		submission.id = persistedSubmission.id;

		submission._virtual = false;
		submission._fields = persistedSubmission.fields;

		submission._status = persistedSubmission.status;
		
		submission.user = persistedSubmission.user;
		submission.userId = persistedSubmission.userId;

		submission._createdAt = persistedSubmission.createdAt;

		return submission;
	}

	constructor(category: string, name: string, subtitle: string) {
		this._category = category;
		this._name = name;
		this._subtitle = subtitle;
	}

	public toJSON(): ISubmission {
		return {
			category: this.category,
			createdAt: this.createdAt,
			fields: this.fields,
			name: this.name,
			subtitle: this.subtitle,
			id: this.id,
			user: this.user,
			userId: this.userId,
			status: this.status,
		}
	}

	get fields(): FieldWithId<ISubmissionField>[] {
		return this._fields;
	}

	get name() {
		return this._name;
	}

	get category() {
		return this._category;
	}

	get subtitle() {
		return this._subtitle;
	}

	get virtual() {
		return this._virtual;
	}

	get createdAt() {
		return this._createdAt;
	}

	get status() {
		return this._status;
	}
}