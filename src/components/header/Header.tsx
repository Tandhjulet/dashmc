"use server";

import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import PhoneHeader from "./PhoneHeader";
import ThemeButton from "./ThemeButton";
import Profile from "./Profile";
import { auth } from "@/auth";
import Link from "next/link";

export default async function Header() {
	const session = await auth();

	return (
		<header className="flex w-full py-2 bg-white/90 dark:bg-[#121212]/90 fixed top-0 z-50 backdrop-blur-md">
			<nav className="hidden sm:inline-flex mx-auto w-full max-w-[1200px] justify-between items-center text-sm">
				<div className="inline-flex items-center gap-3 grow basis-0 ml-6">
					<a href="/rules" className="font-semibold">
						REGLER
					</a>

					<a href="https://dashmc.net/dashboard" className="font-semibold">
						FORUM
						<span className="inline-block">
							<FiArrowUpRight />
						</span>
					</a>
				</div>

				<Link href="/" className="ml-6 sm:ml-0">
					<Image
						src={"/image.png"}
						width={64}
						height={64}
						alt="DashMC Logo"

						className="select-none"
					/>
				</Link>

				<div className="inline-flex items-center gap-3 grow basis-0 justify-end mr-6">
					<a href="https://butik.dashmc.net/" className="font-semibold">
						BUTIK
						<span className="inline-block">
							<FiArrowUpRight />
						</span>
					</a>

					<ThemeButton />

					<Profile session={session} />
				</div>
			</nav>
			<nav className="sm:hidden inline-flex w-full justify-between items-center text-sm">
				<Link href="/" className="ml-6 z-50">
					<Image
						src={"/image.png"}
						width={64}
						height={64}
						alt="DashMC Logo"

						className="select-none"
					/>
				</Link>

				<PhoneHeader session={session} />
			</nav>
		</header>
	)
}