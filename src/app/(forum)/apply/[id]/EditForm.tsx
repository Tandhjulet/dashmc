"use client";

import useModal from "@/components/Modal";
import CreateFormModal from "../../CreateFormModal";

export default function EditForm({
	formId,
}: {
	formId: string;
}) {
	const {
		Modal,
		showModal,
		hideModal,
		shown,
	} = useModal();

	return (
		<>
			<button
				onClick={showModal}
				className="float-right w-fit m-4 px-4 py-2 active:translate-y-[1px] border border-red-700/70 dark:border-red-900/40 hover:bg-red-600/5 rounded-xl text-red-600"
			>
				Rediger
			</button>

			{shown && (
				<div className="overflow-y-clip absolute -top-[3rem] left-0 w-screen h-[calc(100vh)] bg-[#121212]">
					<Modal>
						<CreateFormModal
							formId={formId}
							hideModal={hideModal}
							type="UPDATE"
						/>
					</Modal>
				</div>
			)}
		</>
	)
}