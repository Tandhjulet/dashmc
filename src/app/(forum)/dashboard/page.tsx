"use server";

import { auth } from "@/auth"
import { prisma } from "@/prisma/prisma";
import Link from "next/link";
import { StatusChip } from "../apply/view/[id]/StatusChip";
import { unstable_cache } from "next/cache";

const getUser = (id: string) => unstable_cache(
	async () => {
		console.log("reevaluating:");
		console.log(id);
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


export default async function Dashboard() {
	const session = await auth();
	if(!session?.user?.dbId) {
		return (
				<span>Der opstod en fejl.</span>
			)
	}

	const user = await getUser(session.user.dbId);
	console.log(session.user.dbId);

	return (
		<div className="px-20 py-16">
			<span className="text-xl text-gray-300">
				Velkommen
			</span>
			<h1 className="text-4xl font-extrabold">
				{user?.username}
			</h1>
			<span className="text-gray-600">
				({user?.gameUUID})
			</span>

			<div className="grid grid-cols-3 my-6 h-full max-w-[1200px]">
				<div className="col-span-2 bg-gray-800/25 p-4 rounded-lg">
					<h3 className="font-semibold">Ansøgninger</h3>
					<hr className="my-3 opacity-25" />

					<div className="max-h-[400px] min-h-[275px] flex flex-col gap-3 overflow-y-auto thin-scrollbar pr-2">
						{user?.submissions.length === 0 ? (
							<div className="h-[225px] flex justify-center items-center">
								<span className="text-gray-400">
									Du har ingen ansøgninger
								</span>	
							</div>
						) : user?.submissions.map((submission, i) => (
							<Link
								key={i}
								className="w-full"
								href={"/apply/view/" + submission.id}
							>
								<div className="p-4 bg-gray-800/15 rounded-lg inline-flex w-full justify-between items-center">
									<div className="w-min">
										<span className="text-blue-600 font-bold text-lg">
											{submission.name}
										</span>
										<p>
											{submission.subtitle}
										</p>
									</div>

									<div className="items-end">
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
				
			</div>
		</div>
	)
}