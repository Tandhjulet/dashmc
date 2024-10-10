import { Form } from "@/lib/forms/Form";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

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
		return form;
	},
	['form'],
	{ revalidate: false, tags: ['forms', 'form'] }
)

export const revalidate = 3600;

export default async function Application({
	params,
}: {
	params: { id: string }
}) {
	const form = await getForm(params.id);
	if(!form)
		notFound();

	console.log(form);

	return (
		<main>
			{form.title}
		</main>
	)
}