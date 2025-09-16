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
	if (!session?.user?.dbId) {
		return (
			<span>Der opstod en fejl.</span>
		)
	}

	const user = await getUser(session.user.dbId);

	return (
		<div className="sm:px-10 md:px-20 pt-14 sm:py-14">
			<span className="max-sm:px-5 text-xl text-gray-700 dark:text-gray-300">
				Velkommen
			</span>
			<h1 className="max-sm:px-5 text-4xl font-extrabold">
				{user?.username}
			</h1>
			<span className="hidden sm:block text-gray-400 dark:text-gray-600">
				({user?.gameUUID})
			</span>

			<div className="my-3">
				<Link
					href="/dashboard/admin"
					className="text-sm bg-blue-600 py-1 px-4 rounded-lg"
				>
					Gå til administrationspanel
				</Link>
			</div>

			<div className="flex flex-col lg:grid grid-cols-3 mt-12 h-full gap-6 max-sm:px-5">
				<div className="col-span-2 bg-gray-300/30 dark:bg-gray-800/25 p-4 rounded-lg">
					<h3 className="font-semibold">
						Ansøgninger
						<Link
							className="float-right text-blue-600"
							href="/apply/admin"
						>
							Se alle
							<FiArrowUpRight className="inline align-text-top" />
						</Link>
					</h3>
					<hr className="my-3 border-black dark:border-white opacity-25" />

					<div className="max-lg:max-h-[280px] lg:h-[280px] flex flex-col gap-3 overflow-y-auto thin-scrollbar pr-2">
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
								<div className="py-4 pl-4 pr-2 sm:px-4 bg-gray-400/15 dark:bg-gray-800/15 rounded-lg flex flex-row md:grid grid-cols-3 w-full items-center justify-between">
									<div className="w-fit max-md:mr-2">
										<span className="text-blue-600 font-bold text-lg">
											{submission.name}
										</span>
										<p className="line-clamp-2">
											{submission.subtitle}
										</p>
									</div>

									<div className="hidden md:block text-center text-gray-500 dark:text-gray-600">
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

				<div className="lg:max-xl:hidden col-span-1 bg-gray-300/30 dark:bg-gray-800/25 px-4 xl:py-4 rounded-lg xl:flex flex-col xl:gap-4">
					{STATIC_LINKS.map(({ href, Icon, title, subtitle }, i) => (
						<Link
							href={href}
							className="flex-1 basis-0 flex items-center gap-5 bg-blue-900/[0.075] dark:bg-blue-900/5 px-3 rounded-lg max-lg:py-2 max-lg:my-4"
							target="_blank"
							key={i}
						>
							<div className="p-4 bg-blue-900/10 dark:bg-blue-900/5 rounded-md">
								<Icon className="shrink-0 size-6 text-blue-600" />
							</div>

							<span className="text-blue-600 font-extrabold">
								{title}
								<p
									className="text-black dark:text-white font-normal line-clamp-2"
								>
									{subtitle}
								</p>
							</span>

							<div className="grow" />

							<FaChevronRight className="text-gray-400" />
						</Link>
					))}
				</div>

				<div className="bg-gray-300/30 dark:bg-gray-800/25 p-4 rounded-lg h-full flex flex-col items-center justify-center col-start-3 row-start-1 xl:row-start-2">
					<div className={`p-2 ${user?.discordId ? "bg-green-500/30 dark:bg-green-500/20" : "bg-red-500/30 dark:bg-red-500/20"} rounded-md mb-2`}>
						{user?.discordId ? (
							<BsCheck className="size-8 text-green-600" />
						) : (
							<BsX className="size-8 text-red-500" />
						)}
					</div>
					<span className="font-bold text-gray-800 dark:text-gray-200 text-center my-3">
						Discord verifikation
						<p className="text-sm font-normal dark:text-gray-300">
							{user?.discordId ? "Du har forbundet din discord konto." : "Din discord konto er ikke blevet forbundet."}
						</p>
					</span>

					{user?.discordId ? (
						<span className="mt-4 text-sm text-center text-gray-700 dark:text-gray-500">
							Du er logget ind som:
							<br />
							<strong className="text-gray-800 dark:text-gray-400">
								[ID] {user.discordId}
							</strong>
						</span>
					) : (
						<Link
							className="px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md mt-4"
							href={"/verify/discord"}
						>
							<FaDiscord className="size-5 inline mr-2" />
							Forbind discord
						</Link>
					)}
				</div>

				<div className="bg-gray-300/30 dark:bg-gray-800/25 p-4 rounded-lg h-full col-span-2 xl:col-span-1">
					<h3 className="font-semibold">Kontooplysninger</h3>
					<hr className="my-3 opacity-25" />

					<div className="grid 2xl:grid-cols-2 gap-2 max-w-[450px] mx-auto">
						<div className="inline-flex gap-2 items-center text-gray-700 dark:text-gray-400 col-start-1">
							<FaRegAddressCard className="inline my-auto size-4 shrink-0" />
							<span className="text-[15px]">
								Verificeret
							</span>

							<div className="grow" />
							<BsCheck className="size-6 text-blue-600 shrink-0" />
						</div>

						<div className="inline-flex gap-2 items-center text-gray-700 dark:text-gray-400 col-start-1">
							<FaDiscord className="inline my-auto size-4 shrink-0" />
							<span className="text-[15px]">
								Discord
							</span>

							<div className="grow" />
							{user?.discordId ? (
								<BsCheck className="size-6 text-blue-600 shrink-0" />
							) : (
								<BsX className="size-6 text-red-500 shrink-0" />
							)}
						</div>

						<div className="inline-flex gap-2 items-center text-gray-700 dark:text-gray-400 col-start-1">
							<MdShield className="inline my-auto size-4 shrink-0" />
							<span className="text-[15px]">
								Rolle
							</span>

							<div className="grow" />
							<span className="text-xs">
								<RoleChip role={user?.role} />
							</span>
						</div>


						<div className="col-start-2 row-start-1 row-span-3 hidden flex-col items-center justify-center text-[15px] gap-2 2xl:flex">
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

				<div className="max-sm:hidden bg-gray-300/30 dark:bg-gray-800/25 p-4 rounded-lg">
					<div className="w-full flex flex-col py-2 items-center gap-2">
						<Link href="/" className="text-2xl font-extrabold text-blue-600 my-2">DashMC</Link>

						<nav className="mx-12 w-full max-w-[300px] text-center">
							<Link
								href="/privacy"
								target="_blank"
								className="font-medium rounded-2xl"
							>
								Privatlivspolitik
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

			<div className="sm:hidden bg-gray-300/30 dark:bg-gray-800/25 p-4 rounded-lg mt-12">
				<div className="w-full flex flex-col py-2 items-center gap-2">
					<Link href="/" className="text-2xl font-extrabold text-blue-600 my-2">DashMC</Link>

					<nav className="mx-12 w-full max-w-[300px] text-center">
						<Link
							href="/privacy"
							target="_blank"
							className="font-medium rounded-2xl"
						>
							Privatlivspolitik
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
	)
}