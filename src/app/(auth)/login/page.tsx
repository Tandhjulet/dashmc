import React from "react";
import { Provider } from "../Provider";
import Image from "next/image";

export default function Login() {
	return (
		<>
			<Image
				src={"/image.png"}
				width={128}
				height={128}
				alt="DashMC Logo"
				priority

				className="lg:hidden mx-auto"
			/>

			<h1 className="dark:text-white text-3xl font-semibold text-gray-800 text-center">
				Velkommen tilbage
			</h1>
			<p className="text-center dark:text-gray-200">
				Har du ikke en konto? {" "}
				<a href="/register" className="text-blue-600 underline">
					Opret en her
				</a>
			</p>

			<div className="mx-auto flex flex-col min-w-[300px] w-[60%] gap-4 py-10">
				<Provider
					providerName="Google"
					providerType="google"
				/>

				<Provider
					providerName="Discord"
					providerType="discord"
				/>
			</div>
		</>
	)
}