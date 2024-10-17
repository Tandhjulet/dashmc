import { auth } from "@/auth";
import { Form } from "@/lib/forms/Form";
import { Role } from "@prisma/client";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import CreateField from "./CreateField";
import { FormFields } from "./Field";
import { parseDate } from "@/lib/helpers";
import EditForm from "./EditForm";

export async function generateStaticParams() {
	return (await Form.getAllForms()).map((form) => {
		return {
			id: form.id,
		};
	});
}

const getForm = (id: string) => unstable_cache(
	async () => {
		const form = await Form.fromId(id);
		if(!form)
			notFound();
		return form?.toJSON();
	}, [`get-form:${id}`],
	{ revalidate: false, tags: [`form:${id}`] }
)();

export default async function Application({
	params,
}: {
	params: { id: string }
}) {
	const session = await auth();
	const form = await getForm(params.id);

	if(form.visible !== true && session?.user?.role !== "ADMIN")
		redirect("/dashboard");
	

	return (
		<div className="w-full max-w-[1250px] grid grid-cols-4 gap-2 mx-auto py-12 px-2 phone:px-6 sm:px-12">
			<main className="overflow-clip w-full h-max bg-gray-300/30 dark:bg-gray-800/30 col-span-4 lg:col-span-3 px-4 rounded-md">
				<h1 className="text-2xl font-bold tracking-tight mt-6 mb-2 text-blue-600">
					{form.name}
				</h1>
				<p className="text-gray-800 dark:text-gray-300 text-wrap break-words">
					{form.subtitle}
				</p>

				<hr className="mt-4 border-t-gray-400/60 dark:border-t-gray-700/60" />
				
				<FormFields
					formCuid={form.id!}
					fields={form.fields ?? []}
					isAdmin={session?.user?.role === "ADMIN"}
					isReadOnly={false}
				/>

				{session?.user?.role === Role.ADMIN && <CreateField form={form} />}

				<button
					className="float-right w-fit my-4 px-4 py-2 active:translate-y-[1px] border border-blue-900/40 hover:bg-blue-600/5 rounded-xl text-blue-600"
					form="main-form"
					type="submit"
				>
					Send svar
				</button>
			</main>
			<aside className="hidden lg:block h-fit w-full bg-gray-300/30 dark:bg-gray-800/30 col-span-1 sticky top-0 rounded-md shrink-0">
				<div className="flex flex-col items-center m-4 gap-2">
					<span className={`${form.visible === false ? "text-red-600 dark:text-red-600" : "text-gray-500 dark:text-gray-700"} text-sm mb-1`}>
						{form.visible === false ? (
							<>
								<FaEyeSlash className="inline me-2" />
								Usynlig
							</>
						) : (
							<>
								<FaEye className="inline me-2" />
								Synlig for alle
							</>
						)}
					</span>

					<Image
						width={96}
						height={96}
						src={`https://minotar.net/helm/${form.owner?.gameUUID}/64.png`}
						alt="Skin of form maker"

						className="rounded-3xl"

						priority
					/>
					<span className="text-gray-800 dark:text-gray-300 text-center text-sm">
						Lavet af
						<br />
						<strong className="text-base">
							{form.owner?.username}
						</strong>
					</span>

					<div className="grid grid-cols-2 w-full mt-2">
						<span className="text-gray-800 dark:text-gray-300 text-start text-sm">
							Oprettet:
							<br />
							<strong className="text-base">
								{parseDate(form.createdAt!)}
							</strong>
						</span>

						<span className="text-gray-800 dark:text-gray-300 text-end text-sm">
							Opdateret:
							<br />
							<strong className="text-base">
							{parseDate(form.updatedAt!)}
							</strong>
						</span>
					</div>
				</div>
				
				{session?.user?.role === "ADMIN" && (
					<EditForm
						formId={form.id!}
					/>
				)}
			</aside>
		</div>
	)
}