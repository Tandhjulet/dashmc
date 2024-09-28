import Image from "next/image";
import { FiArrowUpRight, FiSun } from "react-icons/fi";
import { RiMenu3Fill } from "react-icons/ri";

export default function Header() {
	return (
		<header className="flex w-full py-2 bg-white/90 fixed top-0 z-50 backdrop-blur-md">
			<nav className="inline-flex mx-auto w-full max-w-[1200px] justify-between items-center text-sm">
				<div className="hidden sm:inline-flex items-center gap-3 grow basis-0 ml-6">
					<a href="/rules" className="font-semibold">
						REGLER
					</a>

					<a href="#" className="font-semibold">
						FORUM
						<span className="inline-block">
							<FiArrowUpRight />
						</span>
					</a>
				</div>

				<a href="/" className="ml-6 sm:ml-0">
					<Image
						src={"/image.png"}
						width={64}
						height={64}
						alt="DashMC Logo"

						className="select-none"
					/>
				</a>

				<div className="hidden sm:inline-flex items-center gap-3 grow basis-0 justify-end mr-6">
					<a href="#" className="font-semibold">
						BUTIK
						<span className="inline-block">
							<FiArrowUpRight />
						</span>
					</a>

					<button>
						<FiSun className="size-6 text-gray-800" />
					</button>
				</div>

				<button className="mr-6 sm:hidden">
					<RiMenu3Fill className="size-6 text-gray-800" />
				</button>
			</nav>
		</header>
	)
}