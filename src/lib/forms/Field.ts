import { prisma } from "@/prisma/prisma";
import { $Enums } from "@prisma/client";

export type FieldWithId<T> = T & {id: number};

export interface IField {
	title: string;
	subtitle: string | null;
	required: boolean;
	type: $Enums.FieldType;
	formId?: string;
}

export class Field {
	protected _id: number = -1;
	protected form?: string;

	protected _title: string;
	protected _type: $Enums.FieldType;
	protected _subtitle?: string;
	protected _required: boolean;

	protected _dirty: boolean;
	protected _virtual: boolean;

	static async persist(field: IField, formCuid: string): Promise<FieldWithId<IField>> {
		return await prisma.fields.create({
			data: {
				...field,
				formId: formCuid,
			}
		})
	}

	static async delete(id: number): Promise<FieldWithId<IField>> {
		const field = await prisma.fields.delete({
			where: {
				id: id,
			}
		})
		return field;
	}

	constructor(title: string, type: $Enums.FieldType, formCuid: string, subtitle?: string, required?: boolean, id: number = -1) {
		this._title = title;
		this._subtitle = subtitle;

		this._type = type;
		this._required = required ?? false;

		this._dirty = true;
		this._virtual = true;

		this._id = id;
		this.form = formCuid;
	}

	public attachForm(formCuid: string) {
		this.form = formCuid;
		this._dirty = true;
	}

	public async save() {
		if(!this.dirty && !this.virtual)
			return {
					success: this._id !== -1,
					id: this._id
				}
		;

		if(!this.form)
			throw new Error("Tried saving field with no form attached.");

		const persisted = await prisma.fields.upsert({
			where: {
				id: this.id,
			},
			create: {
				type: this.type,

				title: this.title,
				subtitle: this.subtitle,
				required: this.required,

				formId: this.form,
			},
			update: {
				type: this.type,

				title: this.title,
				subtitle: this.subtitle,
				required: this.required,

			}
		});

		this._id = persisted.id;
		this._dirty = false;
		this._virtual = false;

		return {
			success: true,
			id: this._id,
		};
	}

	get id() {
		return this._id;
	}

	get title() {
		return this._title;
	}

	get subtitle() {
		return this._subtitle;
	}
	
	get type() {
		return this._type;
	}

	get required() {
		return this._required;
	}

	get attachedForm() {
		return this.form;
	}

	get dirty() {
		return this._dirty;
	}

	get virtual() {
		return this._virtual;
	}
}