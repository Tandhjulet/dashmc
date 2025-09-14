"use client";

import Popper from "@/components/Popper/Popper";
import { $Enums } from "@prisma/client";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { IoCloudUploadOutline } from "react-icons/io5";

const ChipInner = memo(function getInner({ status }: { status: $Enums.SubmissionStatus }) {
	switch (status) {
		case "Accepted":
			return (
				<div className="bg-green-500/20 inline-flex items-center gap-2 text-green-500 px-2 py-1 rounded-lg">
					<FaCheck className="size-4" />
					Accepteret
				</div>
			)
		case "Rejected":
			return (
				<div className="bg-red-500/20 inline-flex items-center gap-2 text-red-500 px-2 py-1 rounded-lg">
					<FaXmark className="size-4" />
					Afvist
				</div>
			)
		case "Waiting":
			return (
				<div className="bg-orange-500/20 dark:bg-yellow-500/20 inline-flex items-center gap-2 text-orange-500 dark:text-yellow-500 px-2 py-1 rounded-lg">
					<IoCloudUploadOutline className="size-4" />
					Venter
				</div>
			)
	}
});

interface Props {
	submissionId: string;
	status: $Enums.SubmissionStatus;
	isAdmin: boolean;
}

export const StatusChip = memo(function StatusChip(props: Props) {
	const router = useRouter();

	if (!props.isAdmin)
		return <ChipInner status={props.status} />;

	const updateStatus = async (newStatus: $Enums.SubmissionStatus) => {
		if (newStatus === props.status)
			return;

		const body = {
			status: newStatus,
			submissionId: props.submissionId
		};

		(await fetch("/api/form/submission/status", {
			method: "PUT",
			body: JSON.stringify(body)
		})).json().then((res) => {
			if (res.success) {
				router.refresh();
			}
		})
	}


	return (
		<div className="w-min float-right">
			<Popper
				popover={(
					<div className="flex flex-col items-start p-3 gap-3">
						{Object.values($Enums.SubmissionStatus).map((status, i) => (
							<button
								key={i}
								onClick={() => updateStatus(status)}
							>
								<ChipInner status={status} />
							</button>
						))}
					</div>
				)}
			>
				<button>
					<ChipInner status={props.status} />
				</button>
			</Popper>
		</div>
	)
});