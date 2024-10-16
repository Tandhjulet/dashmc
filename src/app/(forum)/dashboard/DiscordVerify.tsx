"use client";

import { useRouter } from "next/router";
import { FaDiscord } from "react-icons/fa6";

export default function DiscordVerify() {
	const router = useRouter();

	return (
		<button
			className="px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md mt-4"
			onClick={() => router.push("/verify/discord")}
		>
			<FaDiscord className="size-5 inline mr-2" />
			Forbind discord
		</button>
	)
}