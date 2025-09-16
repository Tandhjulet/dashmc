"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react"

interface Props {
	submissionId: string
}

export default function DeleteButton({ submissionId }: Props) {
	const router = useRouter();

	const deleteSubmission = useCallback(async () => {

		(await fetch("/api/form/submission", {
			method: "DELETE",
			body: JSON.stringify({submissionId}),
		})).json().then((res) => {
			if(res.success) {
				router.push("/dashboard");
				router.refresh();
			}
		});

	}, [submissionId, router]);

	return (
		<button
			className="px-4 py-2 bg-red-500/10 hover:bg-red-500/15 text-red-500 rounded-lg"
			onClick={deleteSubmission}
		>
			<h4>Slet ansøgning</h4>
		</button>
	)
}