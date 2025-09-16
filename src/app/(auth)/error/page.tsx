"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";

export default function Error() {
	const searchParams = useSearchParams()


	return (
		<div className="text-center">
			<h1 className="text-red-500 text-3xl font-semibold  text-center">
				Der opstod en fejl...
			</h1>
			<span className="text-center dark:text-gray-200">
				Fejlkode:{" "}
				<strong className="text-red-500 font-bold">{searchParams.get("error") ?? "ingen"}</strong>
			</span>
			
			<p className="my-6 max-w-[80%] mx-auto">
				Denne fejl opstår typisk, fordi du forsøger at logge ind med en discord
				konto, som ikke er blevet verifyet. Vi kræver, at du verifyer din discord
				konto, før du kan benytte dig af vores forum.
			</p>

			<span>
				Brug for mere hjælp?
				<br />
				<strong className="text-red-500">
					Skriv til os på vores discord
				</strong>
			</span>

			<Link
				className="flex flex-row w-fit mx-auto items-center py-4 px-6 bg-red-600 gap-3 text-white rounded-full mt-12"
				href={"/"}
			>
				<FaArrowLeft />
				Gå hjem
			</Link>
		</div>
	)
}