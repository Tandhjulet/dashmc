import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

export default function Footer() {
	return (
		<footer className="bg-gray-200/60 w-full max-w-[1200px] mb-0 xl:mb-10 mt-16 phone:mt-32 p-5 mx-auto rounded-2xl dark:bg-gray-800/25">
			<div className="w-full flex flex-col py-3 items-center gap-2">
				<a href="/" className="text-2xl font-extrabold text-blue-600">DashMC</a>
				
				<nav className="mx-12 w-full max-w-[400px] flex justify-between">
					<Link href="/rules" className="font-medium rounded-2xl">
						Regler
					</Link>

					<Link href="/dashboard" target="_blank" className="font-medium rounded-2xl">
						Forum
						<span className="inline-block">
							<FiArrowUpRight />
						</span>
					</Link>

					<Link href="/privacy" className="font-medium rounded-2xl">
						Privatliv
					</Link>

					<Link href="https://butik.dashmc.net/" target="_blank" className="font-medium rounded-2xl">
						Butik
						<span className="inline-block">
							<FiArrowUpRight />
						</span>
					</Link>
				</nav>
				
				<span className="text-gray-800 text-sm text-center my-4 dark:text-gray-500">
					DashMC &copy; 2024
					<br />
					Alle rettigheder forbeholdes
				</span>

				<a href="https://github.com/Tandhjulet/dashmc" target="_blank" className="inline-flex items-center text-[0.9rem]">
					Made with
					<FaHeart className="inline-block text-red-600 size-5 ml-1" />
				</a>
			</div>
		</footer>
	)
}