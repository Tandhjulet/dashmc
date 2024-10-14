"use client";

import { FieldWithId, IField } from "@/lib/forms/Field";
import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";
import { BsTrash } from "react-icons/bs";

interface Props {
	field: FieldWithId<IField>,
	isAdmin: boolean,
	deleteField: (field: FieldWithId<IField>) => void;
	fieldId: number;
}

function TextArea({ field, isAdmin, deleteField, fieldId }: Props) {
	return (
		<div className="my-3">
			<h2 className="text-lg font-bold text-blue-600 relative">
				{field.title}

				{field.required && (
					<span className="text-xs text-red-600 align-top">*</span>
				)}

				{isAdmin && (
					<button
						className="absolute right-0 top-1/2 -translate-y-1/2"
						onClick={() => deleteField(field)}
					>
						<BsTrash className="text-gray-600 hover:text-red-600 size-5" />
					</button>
				)}
			</h2>
			<p className="text-gray-200 text-sm max-w-[80%]">{field.subtitle}</p>

			<textarea
				rows={3}
				form="main-form"
				name={`textarea_${fieldId}`}
				required={field.required}

				className="mt-3 w-full p-2 h-min bg-gray-200 dark:bg-gray-700/40 dark:placeholder:text-gray-500 rounded-lg outline-blue-600 placeholder:text-gray-600 basis-0 border-transparent border-2 focus-visible:outline outline-2"
			/>
		</div>
	)
}

function Section({ field, isAdmin, deleteField }: Props) {
	return (
		<div className="my-3 relative">
			<div className={`opacity-50 separator ${isAdmin && "w-[calc(100%-32px)]"}`}>
				<h2 className="font-bold text-gray-500 relative uppercase">
					{field.title}
					{field.required && (
						<span className="text-xs text-red-600 align-top">*</span>
					)}
				</h2>
			</div>
			{isAdmin && (
				<button
					className="absolute right-0 top-0"
					onClick={() => deleteField(field)}
				>
					<BsTrash className="text-gray-600 hover:text-red-600 size-5" />
				</button>
			)}

			<p className="text-gray-500 text-sm text-center max-w-[70%] mx-auto">{field.subtitle}</p>
		</div>
	)
}

function Checkbox({ field, isAdmin, deleteField, fieldId }: Props) {
	return (
		<div className="flex items-start my-3 relative">
			<input
				type="checkbox"
				className="size-4 my-auto"

				form="main-form"
				name={`checkbox_${fieldId}`}
				required={field.required}
			/>
			<label className="ms-2 text-[1rem] text-gray-300">
				{field.title}
			</label>

			{isAdmin && (
				<button
					className="absolute right-0 top-1/2 -translate-y-1/2 shrink-0"
					onClick={() => deleteField(field)}
				>
					<BsTrash className="text-gray-600 hover:text-red-600 size-5" />
				</button>
			)}
		</div>
	)
}

function Text({ field, isAdmin, deleteField, fieldId }: Props) {
	return (
		<div className="my-3">
			<h2 className="text-lg font-bold text-blue-600 relative">
				{field.title}

				{field.required && (
					<span className="text-xs text-red-600 align-top">*</span>
				)}

				{isAdmin && (
					<button
						className="absolute right-0 top-1/2 -translate-y-1/2"
						onClick={() => deleteField(field)}
					>
						<BsTrash className="text-gray-600 hover:text-red-600 size-5" />
					</button>
				)}
			</h2>
			<p className="text-gray-200 text-sm max-w-[80%]">{field.subtitle}</p>

			<textarea
				rows={1}
				form="main-form"
				name={`text_${fieldId}`}
				required={field.required}
				
				className="mt-3 w-full p-2 h-min bg-gray-200 dark:bg-gray-700/40 dark:placeholder:text-gray-500 rounded-lg outline-blue-600 placeholder:text-gray-600 basis-0 border-transparent border-2 focus-visible:outline outline-2"
			/>
		</div>
	)
}

function Radio({ field, isAdmin, deleteField, fieldId }: Props) {
	const radioElements = field.subtitle?.split("\0\n*");

	return (
		<fieldset
			className="my-3"
			form="main-form"
		>
			<legend className="text-lg font-bold text-blue-600 relative w-full">
				{field.title}
				{field.required && (
					<span className="text-xs text-red-600 align-top">*</span>
				)}

				{isAdmin && (
					<button
						className="absolute right-0 top-1/2 -translate-y-1/2 shrink-0"
						onClick={() => deleteField(field)}
					>
						<BsTrash className="text-gray-600 hover:text-red-600 size-5" />
					</button>
				)}
			</legend>

			<div>
				{radioElements?.map((element, i) => (
					<div
						key={i}
						className="m-1 items-center flex flex-row"
					>
						<input
							type="radio"
							id={`radio_${i}_${fieldId}`}
							name={`radio_${fieldId}`}
							value={element}
							
							className="custom_radio"
							form="main-form"

							required={field.required}
						/>
						<label htmlFor={`radio_${i}_${fieldId}`} className="ms-2">
							{element}
						</label>
					</div>
				))}
			</div>
		</fieldset>
	)
}

export const Field = memo(function Field({ field, isAdmin }: {
	field: FieldWithId<IField>,
	isAdmin: boolean,
}) {
	const router = useRouter();

	const deleteField = useCallback(async (field: FieldWithId<IField>) => {
		(await fetch("/api/form/admin/field", {
			method: "DELETE",
			body: JSON.stringify({ id: field.id }),
		})).json().then((res) => {
			if(res.success) {
				router.refresh();
			}
		})
	}, [router])

	const props = {
		isAdmin,
		field,
		deleteField,
		fieldId: field.id
	}

	switch(field.type) {
		case "Checkbox":
			return <Checkbox {...props} />
		case "Section":
			return <Section {...props} />
		case "TextArea":
			return <TextArea {...props} />
		case "Radio":
			return <Radio {...props} />
		case "Text":
			return <Text {...props} />
		default:
			return <span>Ukendt field type - kontakt en administrator</span>
	}
}, (prev, next) => (
	prev.field.id === next.field.id &&
	prev.isAdmin === next.isAdmin
));

export function FormFields({
	formCuid,
	fields,
	isAdmin
}: {
	formCuid: string,
	fields: FieldWithId<IField>[],
	isAdmin: boolean
}) {
	const router = useRouter();

	const formSubmit = useCallback(async (e: FormData) => {
		const submittedFields: {[id: number]: string} = {}

		for(const field of fields) {
			if(field.type === "Section")
				continue;
			else if(field.type === "Checkbox" && !e.get(`checkbox_${field.id}`)) {
				submittedFields[field.id] = "off";
			} else {
				const prefix = field.type.toLowerCase();
				submittedFields[field.id] = e.get(`${prefix}_${field.id}`)?.toString() ?? "";
			}
		}

		const body = {
			formCuid,
			submission: submittedFields,
		};

		(await fetch("/api/form/submission", {
			method: "POST",
			body: JSON.stringify(body),
		})).json().then((res) => {
			if(res.success) {
				router.push("/dashboard");
			}
		})
		

	}, [fields, router]);

	return (
		<form
			id="main-form"
			action={formSubmit}
		>
			{fields.map((field, i) => (
				<Field
					isAdmin={isAdmin}
					field={field}
					key={i}
				/>
			))}
		</form>
	)
}