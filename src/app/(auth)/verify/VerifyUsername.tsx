"use client";

import { useCallback, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import AwaitingVerification from "./AwaitingVerification";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function VerifyUsername() {
	const [username, setUsername] = useState<string>();

	const onSubmit = useCallback((e: FormData) => {
		const uname = e.get("username")?.toString();
		setUsername(uname);
	}, []);

	const router = useRouter();
	const params = useSearchParams();

	if (username) {
		return (
			<AwaitingVerification
				callback={(res) => {
					if (!res.exists) setUsername(undefined);

					if (res.exists) {
						router.push(new URL(decodeURIComponent(params.get("prevUrl") ?? "/"), window.location.origin).pathname);
					} else router.push("/verify");
				}}
				username={username}
				verify="Minecraft"
			/>
		)
	}

	return (
		<div className="w-full flex flex-col items-center justify-center mb-[8rem] text-center">
			<IoCheckmarkCircleSharp className="size-32 text-green-600 dark:text-green-500 mb-6" />
			<h1 className="text-3xl font-bold text-gray-800 dark:text-white">Verificer dit ingame-navn</h1>
			<p className="max-w-[500px] text-center dark:text-gray-100">
				For at du kan oprette dig på DashMCs hjemmeside, skal vi bruge dit minecraft-brugernavn.
			</p>

			<form
				className="my-6 inline-flex group"
				noValidate
				action={onSubmit}
			>
				<input
					autoComplete="one-time-code"
					id="username"
					name="username"
					placeholder="Brugernavn"
					className="p-4 h-min bg-gray-200 dark:bg-gray-700/40 dark:placeholder:text-gray-500 rounded-lg outline-blue-600 placeholder:text-gray-600 basis-0 border-transparent border-2 focus-visible:outline outline-2"

					required
					pattern=".{3,}"
				/>
				<button
					type="submit"
					className="bg-blue-600 h-full p-[22px] rounded-md ml-3 group-invalid:pointer-events-none group-invalid:opacity-60"
					aria-label="Send brugernavn"
				>
					<FaChevronRight className="size-4 text-white" />
				</button>
			</form>
		</div>
	)
}