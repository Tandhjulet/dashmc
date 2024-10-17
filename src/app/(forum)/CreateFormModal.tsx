"use client";

import useIconPicker from "@/components/IconPicker/IconPicker";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function CreateFormModal({
	hideModal,
}: {
	hideModal: () => void;
}) {
	const router = useRouter();
	const [selectedIcon, setSelectedIcon] = useState<string>("FaUser");

	const createForm = useCallback(async (e: FormData) => {
		const category = e.get("category"),
			  name = e.get("name"),
			  subtitle = e.get("subtitle"),
			  visible = e.get("visibility") === "on";

		if(!category || !name || !subtitle)
			return;

		const body = {
			category,
			name,
			subtitle,
			visible,
			selectedIcon
		};

		(await fetch("/api/form/admin", {
			method: "POST",
			body: JSON.stringify(body),
		})).json()
			.then((res) => {
				if(res.success) {
					hideModal();
					router.refresh();
				}
			}
		)
	}, [hideModal, selectedIcon, router]);

	const {
		IconPicker,
	} = useIconPicker({
		onSelect(iconKey) {
			setSelectedIcon(iconKey);
		},
	});

	return (
		<form
			className="group"
			noValidate
			action={createForm}
		>
			<h1 className="text-xl font-semibold">Opret ny form</h1>
			<span className="text-gray-400">
				Du er ved at oprette en ny form.
				Definer den venligst nedenfor.
			</span>

			<div className="mt-6 grid grid-cols-2 gap-5">
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

				<input
					autoComplete="one-time-code"
					id="category"
					name="category"
					placeholder="Kategori"
					type="text"
					className="p-4 h-min bg-gray-200 dark:bg-gray-700/40 dark:placeholder:text-gray-500 rounded-lg outline-blue-600 placeholder:text-gray-600 basis-0 border-transparent border-2 focus-visible:outline outline-2"

					required
					pattern=".{3,}"
					enterKeyHint="next"
				/>

				<textarea
					placeholder="Beskrivelse"
					rows={3}
					
					id="subtitle"
					name="subtitle"
					
					className="col-span-2 p-4 h-min bg-gray-200 dark:bg-gray-700/40 dark:placeholder:text-gray-500 rounded-lg outline-blue-600 placeholder:text-gray-600 basis-0 border-transparent border-2 focus-visible:outline outline-2"

					required
				/>

				<div>
					<div className="bg-gray-200 dark:bg-blue-600/5 px-2 rounded-md w-full">
						<IconPicker
							selectedIcon={selectedIcon}
						/>
					</div>
				</div>

				<div className="flex items-start mb-6">
					<input
						id="visibility"
						name="visibility"
						type="checkbox"
						className="size-5"
					/>
					<label htmlFor="visibility" className="ms-2 text-sm font-medium text-black dark:text-gray-300">
						Gør denne form synlig for brugere
					</label>
				</div>
			</div>

			<button
				type="submit"
				className="px-4 py-2 bg-blue-600 rounded-lg float-right group-invalid:opacity-70 group-invalid:pointer-events-none"
			>
				Gem
			</button>
		</form>
	)
}