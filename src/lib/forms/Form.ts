import { prisma } from "@/prisma/prisma";
import { Prisma, User } from "@prisma/client";
import { Field, FieldWithId, IField } from "./Field";

export interface IForm {
	title: string;
	subtite: string;
	fields: FieldWithId<IField>[];

	category: string;
	isVirtual: boolean;
	cuid?: string;

	owner?: User;
	ownerCUID?: string;

	createdAt?: Date;
	updatedAt?: Date;
}

export interface FormData {
	id: string;
	title: string;
	fields: IField[];
}

export class Form {
	protected cuid?: string;
	protected _virtual: boolean;
	protected _dirty: boolean;

	protected _title: string;
	protected _category: string;
	protected _subtitle: string;
	protected _fields: FieldWithId<IField>[] = [];

	protected createdAt?: Date;
	protected updatedAt?: Date;

	protected createdBy?: User;
	protected creatorCUID?: string;

	static async getAllForms() {
		const forms = await prisma.form.findMany({
			include: {
				fields: false,
				createdBy: false,
			}
		})

		return forms;
	}

	static async delete(cuid?: string) {
		if(!cuid)
			return false;

		await prisma.form.delete({
			where: {
				id: cuid
			},
			include: {
				fields: true,
			}
		})

		return true;
	}

	static async fromId(cuid: string) {
		const persistedForm = await prisma.form.findFirst({
			where: {
				id: cuid
			},
			include: {
				fields: true,
				submissions: false,
				createdBy: true,
			}
		})
		if(!persistedForm)
			return null

		const form = new Form(persistedForm.name, persistedForm.subtitle, persistedForm.category, cuid);
		form._virtual = false;
		form._dirty = false;
		
		form.createdAt = persistedForm.createdAt;
		form.updatedAt = persistedForm.updatedAt;

		form.createdBy = persistedForm.createdBy;
		form.creatorCUID = persistedForm.createdBy.id;
		form._fields = persistedForm.fields;
		form.cuid = cuid;
		return form;
	}

	static async fromJSON(json: IForm) {
		if(!json.ownerCUID)
			throw new Error("Could not create a new form. No ownerCUID present.");

		const form = new Form(json.title, json.subtite, json.category, json.ownerCUID);
		form.cuid = json.cuid;
		form._virtual = json.isVirtual;

		return form;
	}

	constructor(title: string, subtitle: string, category: string, creatorCUID?: string) {
		this._title = title;
		this._subtitle = subtitle;
		this._category = category;
		this.creatorCUID = creatorCUID;

		this._dirty = true;
		this._virtual = true;
	}

	public async attachOwner(where: Prisma.UserWhereUniqueInput) {
		const owner = await prisma.user.findUnique({
			where
		});

		if(!owner) 
			return false;
		
		this.createdBy = owner;
		this.creatorCUID = owner.id;
		this._dirty = true;

		return true;
	}

	public async save() {
		if(!this.creatorCUID) 
			throw new Error("Tried to save without attaching owner.");
		
		const savedForm = await prisma.form.upsert({
			where: {
				id: this.cuid ?? "-1"
			},
			create: {
				name: this.title,
				subtitle: this._subtitle,
				category: this.category,
				fields: {
					createMany: {
						data: this.fields
					}
				},
				createdBy: {
					connect: {
						id: this.creatorCUID
					}
				}
			},
			update: {
				name: this.title,
				fields: {
					set: this.fields,
				}
			}
		})

		this.cuid = savedForm.id;
		this._dirty = false;
		this._virtual = false;

		return savedForm.id;
	}

	public toJSON(): IForm {
		return {
			title: this.title,
			subtite: this.subtitle,
			fields: this.fields,

			category: this.category,
			isVirtual: this.isVirtual,
			cuid: this.cuid,

			owner: this.createdBy,
			ownerCUID: this.creatorCUID,

			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		}
	}

	get isVirtual() {
		return this._virtual;
	}
	
	get title()  {
		return this._title;
	}

	get category()  {
		return this._category;
	}

	get fields(): FieldWithId<IField>[] {
		return this._fields;
	}

	get subtitle() {
		return this._subtitle;
	}

	public async addField(field: IField | FieldWithId<IField>, formCuid?: string) {
		if("id" in field) {
			this._fields.push(field);
		} else if(formCuid) {
			const fieldWithId = await Field.persist(field, formCuid);
			this._fields.push(fieldWithId);
		} else {
			throw new Error("Unable to create field. Form CUID not provided.");
		}
		this._dirty = true;
	}
}