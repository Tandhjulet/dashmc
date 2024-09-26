import { FaHeart } from "react-icons/fa";

export default function Footer() {
	return (
		<footer className="bg-gray-300 w-full max-w-[1200px] mb-20 mt-32 p-5 mx-auto rounded-2xl">
			<div className="inline-flex w-full justify-between">
				<span>
					<strong className="text-gray-800">
						DashMC
					</strong>
					{" "}&copy; {new Date().getFullYear()}
				</span>

				<a href="#" className="inline-flex items-center">
					Made with
					<FaHeart className="inline-block text-red-600 size-5 ml-1" />
				</a>

				<span className="inline-flex gap-6">
					<a href="#" className="font-medium rounded-2xl">
						Forum
					</a>

					<a href="#" className="font-medium rounded-2xl">
						Butik
					</a>
				</span>
			</div>
		</footer>
	)
}