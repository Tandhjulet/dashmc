import { components, readPrivacyPolicy } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";

// Invalidate cache whan a request comes,
// at most every hour.
export const revalidate = 3600;

export function generateMetadata() {
	const source = readPrivacyPolicy();
	const description =
		typeof source.data.description === "object" ?
			source.data.description.join(" ") : source.data.description;


	return {
		title: source.data.title,
		description: description,
	}
}

export default function Privacy() {
	const source = readPrivacyPolicy();
	const description =
		typeof source.data.description === "object" ?
			source.data.description.join(" ") : source.data.description;

	return (
		<main className="px-3 xl:px-0 md:mx-auto max-w-[1200px] pt-28">
			<h1 className="text-3xl font-bold text-center sm:text-start">{source.data.title}</h1>
			<h2 className="text-center sm:text-start dark:text-gray-300">
				Senest opdateret:{" "}
				<strong className="text-blue-600">{new Date(source.data.lastUpdated).toLocaleDateString()}</strong>
			</h2>
			<p className="mt-3 text-center sm:text-start dark:text-gray-200">
				{description}
			</p>

			<hr className="my-6 mt-5 dark:border-gray-800" />

			<article className="prose text-justify sm:text-start">
				<MDXRemote
					source={source.content}
					components={components}
				/>
			</article>
		</main>
	)
}