import Image from "next/image";
import { FiArrowUpRight, FiSun } from "react-icons/fi";

export default function Header() {
	return (
		<header className="flex w-full py-2 bg-white/90 fixed top-0 z-50 backdrop-blur-md">
			<nav className="inline-flex mx-auto w-full max-w-[1200px] justify-between items-center text-sm">
				<div className="inline-flex items-center gap-3 w-[200px]">
					<a href="#" className="font-semibold">
						FORUM
						<span className="inline-block">
							<FiArrowUpRight />
						</span>
					</a>

					<a href="/rules" className="font-semibold">
						REGLER
						<span className="inline-block">
							<FiArrowUpRight />
						</span>
					</a>
				</div>

				<a href="/">
					<Image
						src={"/image.png"}
						width={64}
						height={64}
						alt="DashMC Logo"

						className="select-none"
					/>
				</a>

				<div className="inline-flex items-center gap-3 w-[200px] justify-end">
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
			</nav>
		</header>
	)
}