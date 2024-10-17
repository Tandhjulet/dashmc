import { prisma } from "@/prisma/prisma";
import { Prisma, User } from "@prisma/client";
import { Field, FieldWithId, IField } from "./Field";

export interface IForm {
	name: string;
	subtitle: string;
	fields?: FieldWithId<IField>[];

	category: string;
	isVirtual?: boolean;
	id?: string;

	icon?: string;
	visible?: boolean;

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

	public name: string;
	public category: string;
	public subtitle: string;
	protected _fields: FieldWithId<IField>[] = [];

	public visible: boolean = true;
	public icon?: string;

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

		const deleteForm = prisma.form.delete({
			where: {
				id: cuid
			}
		});
		const deleteFields = prisma.fields.deleteMany({
			where: {
				formId: cuid,
			}
		})

		await prisma.$transaction([deleteFields, deleteForm]);

		return true;
	}

	static async fromId(cuid: string) {
		const persistedForm = await prisma.form.findFirst({
			where: {
				id: cuid
			},
			include: {
				fields: true,
				createdBy: true,
			}
		})
		if(!persistedForm)
			return null

		const form = new Form(persistedForm.name, persistedForm.subtitle, persistedForm.category);
		form._virtual = false;
		form._dirty = false;
		
		form.createdAt = persistedForm.createdAt;
		form.updatedAt = persistedForm.updatedAt;

		form.visible = persistedForm.visible;
		form.icon = persistedForm.icon;

		form.createdBy = persistedForm.createdBy;
		form.creatorCUID = persistedForm.createdBy.id;
		form._fields = persistedForm.fields;
		form.cuid = cuid;
		return form;
	}

	static async fromJSON(json: IForm) {
		if(!json.ownerCUID)
			throw new Error("Could not create a new form. No ownerCUID present.");

		const form = new Form(json.name, json.subtitle, json.category, json.ownerCUID);
		form.cuid = json.id;
		form._virtual = json.isVirtual ?? false;

		return form;
	}

	constructor(title: string, subtitle: string, category: string, creatorCUID?: string) {
		this.name = title;
		this.subtitle = subtitle;
		this.category = category;
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
		if(!this.creatorCUID || !this.icon) 
			throw new Error(`Tried to save without attaching ${this.creatorCUID ? "icon" : "owner"}.`);
		
		const savedForm = await prisma.form.upsert({
			where: {
				id: this.cuid ?? "-1"
			},
			create: {
				name: this.name,
				subtitle: this.subtitle,
				category: this.category,
				icon: this.icon,
				visible: this.visible,
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
				name: this.name,
				subtitle: this.subtitle,
				category: this.category,
				icon: this.icon,
				visible: this.visible,
				fields: {
					connect: this.fields,
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
			name: this.name,
			subtitle: this.subtitle,
			fields: this.fields,

			category: this.category,
			isVirtual: this.isVirtual,

			id: this.cuid,

			icon: this.icon,
			visible: this.visible,

			owner: this.createdBy,
			ownerCUID: this.creatorCUID,

			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		}
	}

	get isVirtual() {
		return this._virtual;
	}

	get fields(): FieldWithId<IField>[] {
		return this._fields;
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