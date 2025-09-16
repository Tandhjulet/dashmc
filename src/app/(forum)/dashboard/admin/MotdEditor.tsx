"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// this is protected by middleware!
export default function AdminDashboard({
	currMotd,
	currDesc
}: {
	currMotd: string,
	currDesc: string,
}) {
	const router = useRouter();

	const [motd, setMOTD] = useState<string>(currMotd);
	const [description, setDescription] = useState<string>(currDesc);

	return (
		<div className="flex flex-col gap-8 m-4">
			<div className="p-4 bg-gray-300/30 dark:bg-gray-800/25 rounded-md flex flex-col gap-4">
				<span className="font-bold text-blue-600">Rediger meta-tekster</span>

				<input
					defaultValue={currMotd}
					placeholder="Bestem MOTD-tekst på forsiden"
					className="bg-gray-800/30 border border-transparent focus:border-blue-600 w-full rounded-md py-2 px-2 outline-none uppercase"
					onChange={(e) => setMOTD(e.target.value)}
				></input>

				<textarea
					defaultValue={currDesc}
					placeholder="Bestem beskrivelse på forsiden! Bemærk, at HTML er tilladt!"
					className="bg-gray-800/30 border border-transparent focus:border-blue-600 w-full rounded-md py-2 px-2 outline-none"
					onChange={(e) => setDescription(e.target.value)}
				></textarea>

				<div className="ml-auto">
					<button
						className="px-6 py-1 bg-blue-600 rounded-md"
						onClick={async () => {
							const res = await fetch('/api/admin/motd', {
								method: "POST",
								body: JSON.stringify({
									motd,
									description
								})
							});

							if (res.status == 200)
								return;

							router.refresh();
						}}
					>
						Gem
					</button>
				</div>
			</div>
		</div>
	)
}