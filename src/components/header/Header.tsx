"use server";

import Image from "next/image";
import { FiArrowUpRight, FiLogIn } from "react-icons/fi";
import PhoneHeader from "./PhoneHeader";
import ThemeButton from "./ThemeButton";
import { AiOutlineUser } from "react-icons/ai";
import Popper from "../Popper/Popper";
import { RiUserAddLine } from "react-icons/ri";

export default async function Header() {

	return (
		<header className="flex w-full py-2 bg-white/90 dark:bg-[#121212]/90 fixed top-0 z-50 backdrop-blur-md">
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

					<ThemeButton />
					
					<Popper
						popover={(
							<div className="flex flex-col gap-1 px-2 py-2 text-nowrap text-[0.975rem]">
								<a href="/login" className="hover:bg-gray-100 p-2 rounded-md pr-5 dark:hover:bg-gray-800/50">
									<FiLogIn className="inline-block mr-3 size-4 my-auto" />
									Log ind
								</a>

								<hr className="opacity-40 dark:border-t-gray-800" />

								<a href="/register" className="hover:bg-gray-100 p-2 rounded-md pr-5 dark:hover:bg-gray-800/50">
									<RiUserAddLine className="inline-block mr-3 size-4 my-auto" />
									Registrer
								</a>
							</div>
						)}
					>
						<a href="/login" className="font-semibold">
							<AiOutlineUser className="size-6" />
						</a>
					</Popper>
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