"use client";

import Image from "next/image";
import { AiOutlineUser } from "react-icons/ai";
import Popper from "../popper/Popper";
import { RiStackLine, RiUserAddLine, RiUserForbidLine } from "react-icons/ri";
import { FiLogIn } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Profile() {
	const { data } = useSession();

	if(data?.user?.uuid) {
		return (
			<Popper
				popover={(
					<div className="flex flex-col gap-1 px-2 py-2 text-nowrap text-[0.975rem]">
						<Link href="/dashboard" className="hover:bg-gray-100 p-2 rounded-md pr-5 dark:hover:bg-gray-800/50 inline-flex items-center">
							<RiStackLine className="inline-block mr-3 size-4 my-auto" />
							Oversigt
						</Link>

						<hr className="opacity-40 dark:border-t-gray-800" />

						<button
							onClick={() => {
								signOut();
							}}
							className="hover:bg-gray-100 p-2 rounded-md pr-5 dark:hover:bg-gray-800/50 inline-flex items-center text-red-600 dark:text-red-400"
						>
							<RiUserForbidLine className="inline-block mr-3 size-4 my-auto" />
							Log ud
						</button>
					</div>
				)}
			>
				<Image
					src={`https://minotar.net/helm/${data.user.uuid}/24.png`}
					width={24}
					height={24}
					alt="Profile"
					priority

					className="cursor-pointer"
				/>
			</Popper>
		)
	}
	
	
	return (
		<Popper
			popover={(
				<div className="flex flex-col gap-1 px-2 py-2 text-nowrap text-[0.975rem]">
					<Link href="/login" className="hover:bg-gray-100 p-2 rounded-md pr-5 dark:hover:bg-gray-800/50">
						<FiLogIn className="inline-block mr-3 size-4 my-auto" />
						Log ind
					</Link>

					<hr className="opacity-40 dark:border-t-gray-800" />

					<Link href="/register" className="hover:bg-gray-100 p-2 rounded-md pr-5 dark:hover:bg-gray-800/50">
						<RiUserAddLine className="inline-block mr-3 size-4 my-auto" />
						Registrer
					</Link>
				</div>
			)}
		>
			<a href="/login" className="font-semibold">
				<AiOutlineUser className="size-6" />
			</a>
		</Popper>
	)
}