import { prisma } from "@/prisma/prisma";
import { $Enums } from "@prisma/client";

export type FieldWithId<T> = T & {id: number};

export interface IField {
	title: string;
	subtitle: string | null;
	required: boolean;
	type: $Enums.FieldType;
}

export class Field {
	static async persist(field: IField, formCuid: string): Promise<FieldWithId<IField>> {
		return await prisma.fields.create({
			data: {
				...field,
				formId: formCuid,
			}
		})
	}
}