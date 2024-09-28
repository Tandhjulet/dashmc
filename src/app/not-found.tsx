import { FaArrowLeft } from "react-icons/fa6";

export default function NotFound() {
	return (
		<div className="pt-32 mx-auto w-full max-w-[1200px] flex flex-col items-center justify-center h-[calc(100vh-272px)]">
			<h1 className="text-[12.5rem] leading-[13rem] font-black text-blue-600">404</h1>
			<p className="text-center text-xl text-gray-800">
				Vi kan desværre ikke finde
				<br />
				siden som du leder efter.
			</p>

			<a href="/" className="inline-flex items-center py-4 px-6 bg-blue-600 gap-3 text-white rounded-full mt-12">
				<FaArrowLeft />
				Gå hjem
			</a>
		</div>
	)
}