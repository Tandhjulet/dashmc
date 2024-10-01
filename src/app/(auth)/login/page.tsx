import React from "react";
import { Provider } from "../Provider";

export default function Login() {
	return (
		<>
			<h1 className="text-3xl font-semibold text-gray-800 text-center">
				Velkommen tilbage
			</h1>
			<p className="text-center">
				Har du ikke en konto? {" "}
				<a href="/login" className="text-blue-600 underline">
					Opret en her
				</a>
			</p>

			<div className="mx-auto flex flex-col w-[60%] gap-4 py-10">
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