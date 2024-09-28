import Image from "next/image";
import { FiArrowUpRight, FiSun } from "react-icons/fi";
import PhoneHeader from "./PhoneHeader";

export default function Header() {
	return (
		<header className="flex w-full py-2 bg-white/90 fixed top-0 z-50 backdrop-blur-md">
			<nav className="hidden sm:inline-flex mx-auto w-full max-w-[1200px] justify-between items-center text-sm">
				<div className="inline-flex items-center gap-3 grow basis-0 ml-6">
					<a href="/rules" className="font-semibold">
						REGLER
					</a>

					<a href="https://forum.dashmc.net/" className="font-semibold">
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

				<div className="inline-flex items-center gap-3 grow basis-0 justify-end mr-6">
					<a href="https://butik.dashmc.net/" className="font-semibold">
						BUTIK
						<span className="inline-block">
							<FiArrowUpRight />
						</span>
					</a>

					<button>
						<FiSun className="size-6 text-gray-800" />
					</button>
				</div>
			</nav>
			<nav className="sm:hidden inline-flex w-full justify-between items-center text-sm">
				<a href="/" className="ml-6 z-50">
					<Image
						src={"/image.png"}
						width={64}
						height={64}
						alt="DashMC Logo"

						className="select-none"
					/>
				</a>

				<PhoneHeader />
			</nav>
		</header>
	)
}