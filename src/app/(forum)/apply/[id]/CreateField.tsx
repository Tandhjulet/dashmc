"use client";

import useModal from "@/components/Modal";
import { IForm } from "@/lib/forms/Form";
import { $Enums } from "@prisma/client";
import { useRouter } from "next/navigation";
import { memo, useCallback, useRef, useState } from "react";
import { BsTrash } from "react-icons/bs";

function useRadio() {
	const [elements, setElements] = useState<string[]>([]);

	function RadioCreator() {
		const inputRef = useRef<HTMLInputElement>(null);
	
		const RadioElement = memo(function RadioElement({
			element,
			index,
			deleteElement
		}: {
			element: string;
			index: number;
			deleteElement: () => void;
		}) {
			return (
				<li
					className="outline-none py-3 w-full pr-[48px] focus:border-blue-600 align-middle relative group"
					value={element}
					tabIndex={index}
				>
					{element}
					<div className="absolute right-0 top-0 inline-flex items-center h-full gap-1 text-gray-600 invisible group-hover:visible">
						<button
							className="hover:text-red-600"
							onClick={deleteElement}
						>
							<BsTrash className="size-5" />
						</button>
						{/* <MdDragIndicator className="size-6" /> */}
					</div>
				</li>
			)
		}, (prev, next) => prev.index === next.index);
	
		const createRadioElement = (e: FormData) => {
			const radioElement = e.get("new-radio");
			if(!radioElement)
				return;
	
			setElements((prev) => [...prev, radioElement.toString()]);
			inputRef.current!.value = "";
		};
	
		return (
			<div className="col-span-2 flex flex-col mx-3">
				<ul className="list-disc ml-4 blue-disc">
					{elements.map((el, i) => (
						<RadioElement
							index={i}
							element={el}
							key={i}
							deleteElement={() => {
								setElements(
									elements.filter((_, j) => j !== i)
								)
							}}
						/>
					))}
				</ul>
				<form
					action={createRadioElement}
					id="radio-creator"
				>
					<input
						ref={inputRef}
						className="outline-none py-3 border-b border-gray-700 w-full focus:border-blue-600"
						placeholder="Opret nyt"
						enterKeyHint="done"
						type="text"
						role="textbox"
						
						id="new-radio"
						name="new-radio"
						form="radio-creator"
						autoFocus
					/>
				</form>
			</div>
		)
	}

	function clear() {
		setElements([]);
	}

	return {
		RadioCreator,
		elements,
		clear
	}
}

export default function CreateField({
	form,
}: {
	form: IForm,
}) {
	const router = useRouter();
	const [selected, setSelected] = useState<$Enums.FieldType>();

	const {
		RadioCreator,
		elements,
		clear
	} = useRadio();

	const {
		showModal,
		hideModal,
		Modal
	} = useModal();

	const createField = useCallback(async (e: FormData) => {
		const name = e.get("name"),
			  subtitle = e.get("subtitle"),
			  type = e.get("type"),
			  required = e.get("required");

		if(!name || !type || type === "Vælg type")
			return;

		const body = {
			title: name,
			subtitle: type === "Radio" ? elements.join("\0\n*") : subtitle,
			type,
			required: required === "on",
			formCuid: form.cuid,
		};

		(await fetch("/api/form/admin/field", {
			method: "POST",
			body: JSON.stringify(body),
		})).json().then((res) => {
			if(res.success) {
				clear();
				hideModal();
				router.refresh();
			}
		});
	}, [hideModal, router, form, elements, clear]);
	
	return (
		<>
			<button
				className="mt-4 w-full border-2 border-dashed border-blue-600 rounded-3xl py-8 hover:bg-blue-600/5 active:translate-y-[1px]"
				onClick={showModal}
			>
				<span className="text-blue-600 font-semibold text-lg">Opret nyt felt</span>
			</button>

			<Modal className="w-[500px]">
				<h1 className="text-blue-600 font-bold text-lg">
					Opret nyt felt
				</h1>
				<p className="text-gray-200">
					Definer hvordan feltet skal se ud.
				</p>

				<div
					className="w-full grid grid-cols-2 mt-2 gap-2"
				>
					<form id="create-field" action={createField} className="col-span-2" />

					<input
						form="create-field"
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
						form="create-field"
						name="type"
						id="type"
						
						className="p-4 h-min bg-gray-200 dark:bg-gray-700/40 dark:placeholder:text-gray-500 rounded-lg outline-blue-600 placeholder:text-gray-600 basis-0 border-transparent border-2 focus-visible:outline outline-2"
						defaultValue={selected}
						onChange={(value) => {
							setSelected(value.currentTarget.value as $Enums.FieldType);
						}}
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
					
					{selected === "Radio" ? (
						<RadioCreator />
					) : (
						<textarea
							form="create-field"
							placeholder="Beskrivelse"
							rows={selected === "Text" ? 1 : 3}
							
							id="subtitle"
							name="subtitle"
							
							className="col-span-2 p-4 h-min bg-gray-200 dark:bg-gray-700/40 dark:placeholder:text-gray-500 rounded-lg outline-blue-600 placeholder:text-gray-600 basis-0 border-transparent border-2 focus-visible:outline outline-2"
						/>
					)}

					<div className="flex items-start my-3">
						<input
							form="create-field"
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
							form="create-field"
							type="submit"
							className="px-4 py-2 bg-blue-600 rounded-lg float-right group-invalid:opacity-70 group-invalid:pointer-events-none"
						>
							Gem
						</button>
					</div>
				</div>
			</Modal>
		</>
	)
}