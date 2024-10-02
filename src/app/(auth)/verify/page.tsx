"use client";

import { useCallback, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import AwaitingVerification from "./AwaitingVerification";

export default function Verify() {
	const [username, setUsername] = useState<string>();

	const onSubmit = useCallback((e: FormData) => {
		const uname = e.get("username")?.toString();
		setUsername(uname);
	}, []);

	if(username) {
		return <AwaitingVerification />
	}

	return (
		<div className="w-full flex flex-col items-center justify-center mb-[8rem]">
			<IoCheckmarkCircleSharp className="size-32 text-green-600 mb-6" />
			<h1 className="text-3xl font-bold text-gray-800">Verificer dit ingame-navn</h1>
			<p className="max-w-[500px] text-center">
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
					className="p-4 h-min bg-gray-200 rounded-lg outline-blue-600 placeholder:text-gray-600 basis-0 border-transparent border-2"

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

Verify.auth = true;