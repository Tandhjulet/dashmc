"use client";

import { FieldWithId, IField } from "@/lib/forms/Field";
import { ISubmissionField } from "@/lib/forms/Submission";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo } from "react";
import { BsTrash } from "react-icons/bs";

interface Props {
	field: FieldWithId<IField | ISubmissionField>,
	isAdmin: boolean,
	deleteField: (field: FieldWithId<IField>) => void;
	fieldId: number;
	isReadOnly: boolean;
	value?: string;
}

function TextArea({ field, isAdmin, deleteField, fieldId, isReadOnly, value }: Props) {
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
						type="button"
					>
						<BsTrash className="text-gray-600 hover:text-red-600 size-5" />
					</button>
				)}
			</h2>
			<p className="text-gray-800 dark:text-gray-200 text-sm max-w-[80%]">{field.subtitle}</p>

			<textarea
				rows={3}
				form="main-form"
				name={`textarea_${fieldId}`}
				required={field.required}

				readOnly={isReadOnly}
				defaultValue={value}

				className="mt-3 w-full p-2 h-min bg-gray-300/70 dark:bg-gray-700/40 dark:placeholder:text-gray-500 rounded-lg outline-blue-600 placeholder:text-gray-600 basis-0 border-transparent border-2 focus-visible:outline outline-2"
			/>
		</div>
	)
}

function Section({ field, isAdmin, deleteField }: Props) {
	return (
		<div className="my-3 relative">
			<div className={`opacity-90 dark:opacity-50 separator ${isAdmin && "w-[calc(100%-32px)]"}`}>
				<h2 className="font-bold text-gray-800 dark:text-gray-500 relative uppercase">
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
					type="button"
				>
					<BsTrash className="text-gray-600 hover:text-red-600 size-5" />
				</button>
			)}

			<p className={`text-gray-500 text-sm text-center max-w-[70%] mx-auto ${isAdmin && "pr-8"}`}>{field.subtitle}</p>
		</div>
	)
}

function Checkbox({ field, isAdmin, deleteField, fieldId, isReadOnly, value }: Props) {
	return (
		<div className="flex items-start my-3 relative">
			<input
				type="checkbox"
				className="size-4 mt-1"

				form="main-form"
				name={`checkbox_${fieldId}`}
				required={field.required}

				readOnly={isReadOnly}

				defaultChecked={value === "on"}
			/>
			<label className="ms-2 text-[1rem] text-blue-600 font-semibold max-w-[70%] leading-6">
				{field.title}
				{field.required && (
					<span className="text-xs text-red-600 align-top">*</span>
				)}

				{field.subtitle && (
					<small className="text-gray-800 dark:text-gray-300 font-normal">
						<br />
						{field.subtitle}
					</small>
				)}
			</label>

			{isAdmin && (
				<button
					className="absolute right-0 top-1/2 -translate-y-1/2 shrink-0"
					onClick={() => deleteField(field)}
					type="button"
				>
					<BsTrash className="text-gray-600 hover:text-red-600 size-5" />
				</button>
			)}
		</div>
	)
}

function Text({ field, isAdmin, deleteField, fieldId, isReadOnly, value }: Props) {
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
						type="button"
					>
						<BsTrash className="text-gray-600 hover:text-red-600 size-5" />
					</button>
				)}
			</h2>
			<p className="text-gray-800 dark:text-gray-200 text-sm max-w-[80%]">{field.subtitle}</p>

			<textarea
				rows={1}
				form="main-form"
				name={`text_${fieldId}`}
				required={field.required}

				readOnly={isReadOnly}
				defaultValue={value}
				
				className="mt-3 w-full p-2 h-min bg-gray-300/70 dark:bg-gray-700/40 dark:placeholder:text-gray-500 rounded-lg outline-blue-600 placeholder:text-gray-600 basis-0 border-transparent border-2 focus-visible:outline outline-2"
			/>
		</div>
	)
}

function Radio({ field, isAdmin, deleteField, fieldId, isReadOnly, value }: Props) {
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
						type="button"
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

							disabled={isReadOnly}
							defaultChecked={element === value}
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

export const Field = memo(function Field({ field, isAdmin, isReadOnly }: {
	field: FieldWithId<IField | ISubmissionField>,
	isAdmin: boolean,
	isReadOnly: boolean,
}) {
	const router = useRouter();

	const deleteField = useCallback(async (field: FieldWithId<IField | ISubmissionField>) => {
		(await fetch("/api/form/admin/field", {
			method: "DELETE",
			body: JSON.stringify({ id: field.id }),
		})).json().then((res) => {
			if(res.success) {
				router.refresh();
			}
		})
	}, [router])

	const value = useMemo(() => {
		if("answer" in field) 
			return field.answer as string;
		return undefined;
	}, [field])

	const props = {
		isAdmin,
		field,
		deleteField,
		fieldId: field.id,
		isReadOnly,
		value,
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
	isAdmin,
	isReadOnly = false,
}: {
	formCuid: string,
	fields: FieldWithId<IField | ISubmissionField>[],
	isAdmin: boolean,
	isReadOnly: boolean,
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
				router.refresh();
			}
		})
	}, [fields, router, formCuid]);

	return (
		<form
			id="main-form"
			action={isReadOnly ? undefined : formSubmit}
		>
			{fields.map((field, i) => (
				<Field
					isAdmin={isAdmin && !isReadOnly}
					isReadOnly={isReadOnly}
					field={field}
					key={i}
				/>
			))}
		</form>
	)
}