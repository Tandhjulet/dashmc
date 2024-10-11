"use client";

import useModal from "@/components/Modal";
import { IForm } from "@/lib/forms/Form";
import { $Enums } from "@prisma/client";
import { useCallback } from "react";

export default function CreateField({
	form,
}: {
	form: IForm,
}) {
	const {
		showModal,
		Modal
	} = useModal();

	const createField = useCallback(async (e: FormData) => {
		const name = e.get("name"),
			  description = e.get("description"),
			  type = e.get("type"),
			  required = e.get("required");

		if(!name || !description || !type)
			return;

	}, []);
	
	return (
		<>
			<button
				className="w-full border-2 border-dashed border-blue-600 rounded-3xl py-8 hover:bg-blue-600/5 active:translate-y-[1px]"
				onClick={showModal}
			>
				<span className="text-blue-600 font-semibold text-lg">Opret nyt felt</span>
			</button>

			<Modal className="w-[500px]">
				<h1 style={{
					marginTop: 0,
					marginBottom: 0,
				}}>
					Opret nyt felt
				</h1>
				<p className="text-gray-200">
					Definer hvordan feltet skal se ud.
				</p>

				<form
					className="w-full grid grid-cols-2 mt-4 gap-2"
					action={createField}
				>
					<input
						autoComplete="one-time-code"
						id="name"
						name="name"
						placeholder="Navn"
						type="text"
						className="p-4 h-min bg-gray-200 dark:bg-gray-700/40 dark:placeholder:text-gray-500 rounded-lg outline-blue-600 placeholder:text-gray-600 basis-0 border-transparent border-2 focus-visible:outline outline-2"

						required
						autoFocus
						pattern=".{3,}"
					/>

					<select
						name="type"
						id="type"
						
						className="p-4 h-min bg-gray-200 dark:bg-gray-700/40 dark:placeholder:text-gray-500 rounded-lg outline-blue-600 placeholder:text-gray-600 basis-0 border-transparent border-2 focus-visible:outline outline-2"
						defaultValue={"Vælg type"}
						required
					>
						<option value={"Vælg type"} disabled className="bg-[#121212]">Vælg type</option>

						{Object.values($Enums.FieldType).map((type, i) => {
							return (
								<option value={type} key={i} className="bg-[#121212]">
									{type}
								</option>
							)
						})}
					</select>

					<textarea
						placeholder="Beskrivelse"
						rows={3}
						
						id="description"
						name="description"
						
						className="col-span-2 p-4 h-min bg-gray-200 dark:bg-gray-700/40 dark:placeholder:text-gray-500 rounded-lg outline-blue-600 placeholder:text-gray-600 basis-0 border-transparent border-2 focus-visible:outline outline-2"

						required
					/>

					<div className="flex items-start my-3">
						<input
							id="required"
							name="required"
							type="checkbox"
							className="size-5"
						/>
						<label htmlFor="required" className="ms-2 text-sm text-gray-300">
							Feltet er påkrævet en besvarelse (*)
						</label>
					</div>
					
					<div className="my-auto">
						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 rounded-lg float-right group-invalid:opacity-70 group-invalid:pointer-events-none"
						>
							Gem
						</button>
					</div>
				</form>
			</Modal>
		</>
	)
}