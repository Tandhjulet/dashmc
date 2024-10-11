import { auth } from "@/auth";
import { Form } from "@/lib/forms/Form";
import { Role } from "@prisma/client";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaEye } from "react-icons/fa6";
import CreateField from "./CreateField";

export async function generateStaticParams() {
	return (await Form.getAllForms()).map((form) => {
		return {
			id: form.id,
		};
	});
}

const getForm = unstable_cache(
	async (id: string) => {
		const form = await Form.fromId(id);
		if(!form)
			notFound();
		return form?.toJSON();
	},
	['form'],
	{ revalidate: false, tags: ['specific_form', 'form'] }
)

export default async function Application({
	params,
}: {
	params: { id: string }
}) {
	const session = await auth();
	const form = await getForm(params.id);

	return (
		<div className="w-full max-w-[1250px] grid grid-cols-4 gap-2 mx-auto p-12">
			<main className="w-full h-fit bg-gray-800/30 col-span-3 px-4 prose rounded-l-md">
				<h1>
					{form.title}
				</h1>
				<span className="text-gray-300">
					{form.subtite}
				</span>

				<hr className="my-4 border-t-gray-700/60" />

				{session?.user?.role === Role.ADMIN && <CreateField form={form} />}

				<button className="float-right w-fit my-4 px-4 py-2 active:translate-y-[1px] border border-blue-900/40 hover:bg-blue-600/5 rounded-xl text-blue-600">
					Send svar
				</button>
			</main>
			<aside className="w-full bg-gray-800/30 col-span-1 sticky top-0 rounded-r-md">
				<div className="flex flex-col items-center m-4 gap-2">
					<span className="text-gray-700 text-sm mb-1">
						<FaEye className="inline me-2" />
						Synlig for alle
					</span>

					<Image
						width={96}
						height={96}
						src={`https://minotar.net/helm/Tandhjulet/64.png`}
						alt="Skin of form maker"

						className="rounded-3xl"

						priority
					/>
					<span className="text-gray-300 text-center text-sm">
						Lavet af
						<br />
						<strong className="text-base">
							Tandhjulet
						</strong>
					</span>

					<div className="grid grid-cols-2 w-full mt-2">
						<span className="text-gray-300 text-start text-sm">
							Oprettet:
							<br />
							<strong className="text-base">
								9. sep, 2024
							</strong>
						</span>

						<span className="text-gray-300 text-end text-sm">
							Opdateret:
							<br />
							<strong className="text-base">
								9. sep, 2024
							</strong>
						</span>
					</div>
				</div>

				<button className="float-right w-fit m-4 px-4 py-2 active:translate-y-[1px] border border-red-900/40 hover:bg-red-600/5 rounded-xl text-red-600">
					Rediger
				</button>
			</aside>
		</div>
	)
}