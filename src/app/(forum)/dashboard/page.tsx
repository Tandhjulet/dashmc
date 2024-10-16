"use server";

import { auth } from "@/auth"
import { prisma } from "@/prisma/prisma";
import Link from "next/link";
import { StatusChip } from "../apply/view/[id]/StatusChip";
import { unstable_cache } from "next/cache";
import { parseDate } from "@/lib/helpers";
import { IconBaseProps } from "react-icons/lib";
import { MdOutlineFlipToFront, MdShield, MdStorefront } from "react-icons/md";
import { FaChevronRight, FaDiscord, FaHeart, FaRegAddressCard } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import { BsCheck, BsClipboard2Check, BsX } from "react-icons/bs";
import Image from "next/image";
import { RoleChip } from "./RoleChip";

const getUser = (id: string) => unstable_cache(
	async () => {
		const user = await prisma.user.findUnique({
			where: {
				id,
			},
			include: {
				submissions: true,
			}
		})
		return user;
	}, [`get-user:${id}`],
	{ tags: [`user:${id}`] }
)();

const STATIC_LINKS: {
	href: string;
	title: string;
	Icon: React.FC<IconBaseProps>;
	subtitle: string;
}[] = [{
	href: "/",
	title: "Butik",
	Icon: MdStorefront,
	subtitle: "Find noget du kan lide"
}, {
	href: "/",
	title: "Forside",
	Icon: MdOutlineFlipToFront,
	subtitle: "Gå til forsiden"
}, {
	href: "/rules",
	title: "Regler",
	Icon: BsClipboard2Check,
	subtitle: "Læs op på reglerne"
}]

export default async function Dashboard() {
	const session = await auth();
	if(!session?.user?.dbId) {
		return (
				<span>Der opstod en fejl.</span>
			)
	}

	const user = await getUser(session.user.dbId);

	return (
		<div className="px-20 py-12">
			<span className="text-xl text-gray-700 dark:text-gray-300">
				Velkommen
			</span>
			<h1 className="text-4xl font-extrabold">
				{user?.username}
			</h1>
			<span className="text-gray-400 dark:text-gray-600">
				({user?.gameUUID})
			</span>

			<div className="grid grid-cols-3 my-6 h-full gap-6">
				<div className="col-span-2 bg-gray-300/30 dark:bg-gray-800/25 p-4 rounded-lg">
					<h3 className="font-semibold">Ansøgninger</h3>
					<hr className="my-3 border-black dark:border-white opacity-25" />

					<div className="h-[280px] flex flex-col gap-3 overflow-y-auto thin-scrollbar pr-2">
						{user?.submissions.length === 0 ? (
							<div className="h-[225px] flex justify-center items-center">
								<span className="text-gray-700 dark:text-gray-400">
									Du har ingen ansøgninger
								</span>	
							</div>
						) : user?.submissions.toReversed().map((submission, i) => (
							<Link
								key={i}
								className="w-full"
								href={"/apply/view/" + submission.id}
							>
								<div className="p-4 bg-gray-400/15 dark:bg-gray-800/15 rounded-lg grid grid-cols-3 w-full items-center">
									<div className="w-min">
										<span className="text-blue-600 font-bold text-lg">
											{submission.name}
										</span>
										<p>
											{submission.subtitle}
										</p>
									</div>

									<div className="text-center text-gray-500 dark:text-gray-600">
										{parseDate(submission.createdAt)}
									</div>

									<div className="ml-auto w-min">
										<StatusChip
											isAdmin={false}
											status={submission.status}
											submissionId={submission.id}
										/>
									</div>
								</div>
							</Link>
						))}

					</div>
				</div>

				<div className="col-span-1 bg-gray-300/30 dark:bg-gray-800/25 p-4 rounded-lg flex flex-col gap-4">
					{STATIC_LINKS.map(({ href, Icon, title, subtitle }, i) => (
						<Link
							href={href}
							className="flex-1 basis-0 flex items-center gap-5 bg-blue-900/[0.075] dark:bg-blue-900/5 px-3 rounded-lg"
							target="_blank"
							key={i}
						>
							<div className="p-4 bg-blue-900/10 dark:bg-blue-900/5 rounded-md">
								<Icon className="shrink-0 size-6 text-blue-600" />
							</div>

							<span className="text-blue-600 font-extrabold">
								{title}
								<p className="text-black dark:text-white font-normal">
									{subtitle}
								</p>
							</span>

							<div className="grow" />

							<FaChevronRight className="text-gray-400" />
						</Link>
					))}
				</div>

				<div className="bg-gray-300/30 dark:bg-gray-800/25 p-4 rounded-lg h-full">
					<h3 className="font-semibold">Kontooplysninger</h3>
					<hr className="my-3 opacity-25" />

					<div className="grid grid-cols-2 gap-2">
						<div className="inline-flex gap-2 items-center text-gray-700 dark:text-gray-400 col-start-1">
							<FaRegAddressCard className="inline my-auto size-4" />
							<span className="text-[15px]">
								Verificeret
							</span>

							<div className="grow" />
							<BsCheck className="size-6 text-blue-600" />
						</div>

						<div className="inline-flex gap-2 items-center text-gray-700 dark:text-gray-400 col-start-1">
							<FaDiscord className="inline my-auto size-4" />
							<span className="text-[15px]">
								Discord
							</span>

							<div className="grow" />
							{user?.discordId ? (
								<BsCheck className="size-6 text-blue-600" />
							) : (
								<BsX className="size-6 text-red-500" />
							)}
						</div>

						<div className="inline-flex gap-2 items-center text-gray-700 dark:text-gray-400 col-start-1">
							<MdShield className="inline my-auto size-4" />
							<span className="text-[15px]">
								Rolle
							</span>

							<div className="grow" />
							<span className="text-xs">
								<RoleChip role={user?.role} />
							</span>
						</div>


						<div className="col-start-2 row-start-1 row-span-3 flex flex-col items-center justify-center text-[15px] gap-2">
							<Image
								src={`https://minotar.net/helm/${user?.gameUUID}/32.png`}
								width={32}
								height={32}
								alt="Profile"
								priority

								className="cursor-pointer"
							/>

							<span className="text-gray-700 dark:text-gray-400 font-bold text-sm">{user?.username}</span>
						</div>
					</div>
					
					<div className="text-center text-xs mt-7">
						Er der noget galt?
						<br />
						<span className="text-blue-600">
							Kontakt en moderator eller over på discorden
						</span>
					</div>
				</div>

				<div className="bg-gray-300/30 dark:bg-gray-800/25 p-4 rounded-lg h-full">
				</div>

				<div className="bg-gray-300/30 dark:bg-gray-800/25 p-4 rounded-lg col-start-3">
					<div className="w-full flex flex-col py-2 items-center gap-2">
						<a href="/" className="text-2xl font-extrabold text-blue-600 my-2">DashMC</a>

						<nav className="mx-12 w-full max-w-[300px] flex justify-between">
							<Link
								href="https://dashmc.net/privacy"
								target="_blank"
								className="font-medium rounded-2xl"
							>
								Privatlivspolitik
								<span className="inline-block">
									<FiArrowUpRight />
								</span>
							</Link>

							<Link
								href="https://dashmc.net/tos"
								target="_blank"
								className="font-medium rounded-2xl"
							>
								Servicevilkår
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
				</div>
				
			</div>
		</div>
	)
}