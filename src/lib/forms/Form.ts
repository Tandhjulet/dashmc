import { prisma } from "@/prisma/prisma";
import { $Enums } from "@prisma/client";

export interface Field {
	id: number;

	title: string;
	subtitle: string | null;
	required: boolean;
	type: $Enums.FieldType;
}

export interface FormData {
	id: string;
	title: string;
	fields: Field[];
}

export class Form {
	protected cuid?: string;
	protected _virtual: boolean;
	protected _dirty: boolean;

	protected _title: string;
	protected _category: string;
	protected _fields: Field[];

	static async getAllForms() {
		const forms = await prisma.form.findMany({
			include: {
				fields: false,
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
			}
		})
		if(!persistedForm)
			return null

		const form = new Form(persistedForm.name, persistedForm.category, persistedForm.fields);
		form._virtual = false;
		form._dirty = false;

		form.cuid = cuid;
		return form;
	}

	constructor(title: string, category: string, fields: Field[] = []) {
		this._title = title;
		this._fields = fields;

		this._dirty = true;
		this._virtual = true;
		this._category = category;
	}

	public async save() {
		const savedForm = await prisma.form.upsert({
			where: {
				id: this.cuid ?? "-1"
			},
			create: {
				name: this.title,
				category: this.category,
				fields: {
					createMany: {
						data: this.fields
					}
				}
			},
			update: {
				name: this.title,
				fields: {
					set: this.fields
				}
			}
		})

		this.cuid = savedForm.id;
		this._dirty = false;

		return savedForm.id;
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

	get fields() {
		return this._fields;
	}
}