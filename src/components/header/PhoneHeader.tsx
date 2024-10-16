"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useLayoutEffect } from "react";
import { useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { MdStorefront } from "react-icons/md";
import { PiChatsCircleDuotone, PiNewspaperClipping } from "react-icons/pi";
import { RiMenu3Fill, RiUserForbidLine } from "react-icons/ri";

export default function PhoneHeader({
	session,
}: {
	session: Session | null,
}) {
	const [ show, setShow ] = useState(false);

	const { setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useLayoutEffect(() => {
		setMounted(true);
	}, []);

	return (
		<>
			<button
				className="mr-6"
				onClick={() => setShow(prev => !prev)}
				aria-hidden={!show}
			>
				<RiMenu3Fill className="size-6 text-gray-800 dark:text-gray-300 z-50" />
			</button>

			{show && (
				<div className="flex flex-col w-screen h-screen absolute top-0 z-40 bg-white dark:bg-[#121212]">
					<div className="h-20 w-full flex items-center justify-end">
						<button
							className="mr-6"
							onClick={() => setShow(prev => !prev)}
							aria-hidden={show}
						>
							<IoClose className="size-6 text-gray-800 dark:text-gray-300 z-50" />
						</button>
					</div>
					
					<div className="flex flex-col px-4 gap-2 mt-2">
						<Link href="/" className="inline-flex items-center p-4 bg-gray-300/30 dark:bg-gray-700/10 rounded-lg gap-2 whitespace-nowrap w-full">
							<MdStorefront className="inline-block mr-3 size-4 my-auto" />
							Butik
						</Link>

						<Link href="/" className="inline-flex items-center p-4 bg-gray-300/30 dark:bg-gray-700/10 rounded-lg gap-2 whitespace-nowrap w-full">
							<PiChatsCircleDuotone className="inline-block mr-3 size-4 my-auto" />
							Forum
						</Link>

						<Link href="/" className="inline-flex items-center p-4 bg-gray-300/30 dark:bg-gray-700/10 rounded-lg gap-2 whitespace-nowrap w-full">
							<PiNewspaperClipping className="inline-block mr-3 size-4 my-auto" />
							Regler
						</Link>

						<hr className="opacity-60 dark:border-t-gray-800 my-2" />

						{session?.user ? (
							<button
								onClick={() => {
									signOut({ redirectTo: "/" });
								}}
								className="inline-flex items-center p-4 bg-gray-300/30 dark:bg-gray-700/10 rounded-lg gap-2 whitespace-nowrap w-full text-red-600 dark:text-red-400"
							>
								<RiUserForbidLine className="inline-block mr-3 size-4 my-auto" />
								Log ud
							</button>
						) : (
							<Link
								href="/login"
								className="inline-flex items-center p-4 bg-gray-300/30 dark:bg-gray-700/10 rounded-lg gap-2 whitespace-nowrap w-full text-green-600 dark:text-green-400"
							>
								<RiUserForbidLine className="inline-block mr-3 size-4 my-auto" />
								Log ind
							</Link>
						)}

						{mounted && (
							<button onClick={() => {
								setTheme(resolvedTheme === "dark" ? "light" : "dark");
							}} className="inline-flex items-center p-4 bg-gray-300/30 dark:bg-gray-700/10 rounded-lg gap-2 whitespace-nowrap w-full">
								{resolvedTheme === "dark" ? (
									<FiMoon className="size-4 text-gray-200 mr-3" />
								) : (
									<FiSun className="size-4 text-gray-800 mr-3" />
								)}
								Skift tema
							</button>
						)}
					</div>

					<div className="grow" />
					
					<span className="p-4 text-gray-400 dark:text-gray-700 text-sm">
						<strong
							className="dark:text-gray-800"
						>
							DashMC
						</strong> &copy; 2024
					</span>
				</div>
			)}
		</>
	)
}