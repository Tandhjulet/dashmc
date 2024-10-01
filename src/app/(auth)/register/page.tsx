import React from "react";
import { Provider } from "../Provider";

export default function Register() {
	return (
		<>
			<h1 className="text-3xl font-semibold text-gray-800 text-center">
				Opret en konto
			</h1>
			<p className="text-center">
				Har du allerede en konto? {" "}
				<a href="/login" className="text-blue-600 underline">
					Log ind
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

			{/* <div className="separator text-sm text-gray-500">Eller registrer dig selv</div>

			<form className="py-10 w-full grid grid-cols-2 gap-4">
				<input autoComplete="one-time-code" placeholder="Minecraft navn" className="p-4 h-min bg-gray-200 rounded-lg outline-blue-600 placeholder:text-gray-600" />
				<input autoComplete="one-time-code" placeholder="Brugernavn" className="p-4 h-min bg-gray-200 rounded-lg outline-blue-600 placeholder:text-gray-600" />

				<input autoComplete="new-password" type="password" placeholder="Kodeord" className="p-4 h-min bg-gray-200 rounded-lg outline-blue-600 placeholder:text-gray-600" />
				<input type="password" placeholder="Gentag kodeord" className="p-4 h-min bg-gray-200 rounded-lg outline-blue-600 placeholder:text-gray-600" />

				<div className="col-span-2 mx-auto w-1/2 mt-12">
					<button
						type="submit"
						className="bg-blue-600 text-white p-4 rounded-lg w-full"
					>
						Opret konto	
					</button>
				</div>
			</form> */}
		</>
	)
}

