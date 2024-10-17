import { auth } from "@/auth";
import { Submission } from "@/lib/forms/Submission";
import { unstable_cache } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { FormFields } from "../../[id]/Field";
import Image from "next/image";
import { parseDate } from "@/lib/helpers";
import { StatusChip } from "./StatusChip";
import DeleteButton from "./DeleteSubmission";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
	return (await Submission.getAllSubmissions()).map((submission) => {
		return {
			id: submission.id,
		};
	});
}

const getSubmission = (id: string) => unstable_cache(
	async () => {
		const submission = await Submission.fromId(id);
		if(!submission)
			notFound();
		return submission?.toJSON();
	}, [`get-submission:${id}`],
	{ revalidate: false, tags: [`submission:${id}`] }
)()

export default async function View({
	params,
}: {
	params: { id: string }
}) {
	const session = await auth();
	if(!session)
		redirect("/");
	
	const submission = await getSubmission(params.id);
	
	if(!submission.userId)
		throw new Error("userId missing");

	if(
		!session.user?.dbId || (
		submission.userId !== session.user?.dbId &&
		session.user?.role === "USER")) {
		return (
			<div className="w-full h-screen flex flex-col items-center justify-center">
				<h1 className="text-blue-600 font-semibold text-3xl">Du har ikke adgang til dette!</h1>
				<p>
					Kontakt en administrator hvis du mener dette er en fejl.
				</p>
			</div>
		)
	}

	return (
		<div className="w-full max-w-[1250px] grid grid-cols-4 gap-2 mx-auto py-12 px-2 phone:px-6 sm:px-12">
			<main className="w-full h-fit bg-gray-300/30 dark:bg-gray-800/30 col-span-4 lg:col-span-3 px-4 rounded-md shrink">
				<h1 className="text-2xl font-bold tracking-tight mt-6 mb-2 text-blue-600">
					{submission.name}
				</h1>
				<span className="text-gray-800 dark:text-gray-300">
					{submission.subtitle}
				</span>

				<hr className="mt-4 border-t-gray-400/60 dark:border-t-gray-700/60" />
				
				<FormFields
					formCuid={submission.id!}
					fields={submission.fields}
					isAdmin={session?.user?.role === "ADMIN"}
					isReadOnly={true}
				/>

			</main>
			<aside className="hidden lg:block h-fit w-full bg-gray-300/30 dark:bg-gray-800/30 col-span-1 sticky top-0 rounded-md shrink-0">
				<div className="flex flex-col items-center m-4 gap-2">
					<Image
						width={96}
						height={96}
						src={`https://minotar.net/helm/${submission.user?.gameUUID}/64.png`}
						alt="Skin of form maker"

						className="rounded-3xl"

						priority
					/>
					<span className="text-gray-800 dark:text-gray-300 text-center text-sm">
						Indsendt af
						<br />
						<strong className="text-base">
							{submission.user?.username}
						</strong>
					</span>

					<div className="grid grid-cols-2 w-full mt-2 z-10">
						<span className="text-gray-800 dark:text-gray-300 text-start text-sm">
							Oprettet:
							<br />
							<strong className="text-base">
								{parseDate(submission.createdAt!)}
							</strong>
						</span>

						<span className="text-end text-sm my-2">
							<StatusChip
								submissionId={params.id}
								status={submission.status}
								isAdmin={session.user.role === "ADMIN"}
							/>
						</span>
					</div>

					{session.user.role === "ADMIN" && (
						<>
							<hr className="dark:opacity-5 w-full my-3 z-0" />
							<div className="text-start">
								<DeleteButton submissionId={params.id} />
							</div>
						</>	
					)}
				</div>
			</aside>
		</div>
	)
}