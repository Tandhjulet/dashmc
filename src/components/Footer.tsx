import { FaHeart } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

export default function Footer() {
	return (
		<footer className="bg-gray-200/60 w-full max-w-[1200px] mb-20 mt-32 p-5 mx-auto rounded-2xl">
			<div className="inline-flex w-full justify-between">
				<span className="w-[300px]">
					<a href="/" className="text-gray-800 font-bold">
						DashMC
					</a>
					{" "}&copy; {new Date().getFullYear()}
				</span>

				<a href="https://github.com/Tandhjulet/dashmc" target="_blank" className="inline-flex items-center">
					Made with
					<FaHeart className="inline-block text-red-600 size-5 ml-1" />
				</a>

				<span className="inline-flex gap-6 w-[300px] justify-end">
					<a href="/rules" className="font-medium rounded-2xl">
						Regler
					</a>

					<a href="#" target="_blank" className="font-medium rounded-2xl">
						Forum
						<span className="inline-block">
							<FiArrowUpRight />
						</span>
					</a>

					<a href="#" target="_blank" className="font-medium rounded-2xl">
						Butik
						<span className="inline-block">
							<FiArrowUpRight />
						</span>
					</a>
				</span>
			</div>
		</footer>
	)
}