import { components, readRules } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";

// Invalidate cache whan a request comes,
// at most every hour.
export const revalidate = 3600;

export function generateMetadata() {
	const source = readRules();
	const description =
		typeof source.data.description === "object" ?
			source.data.description.join(" ") : source.data.description;


	return {
		title: source.data.title,
		description: description,
	}
}

export default function Rules() {
	const source = readRules();
	const description =
		typeof source.data.description === "object" ?
			source.data.description.join(" ") : source.data.description;

	return (
		<main className="min mx-auto max-w-[1200px] pt-28">
			<h1 className="text-3xl font-bold">{source.data.title}</h1>
			<h2>
				Senest opdateret:{" "}
				<strong className="text-blue-600">{new Date(source.data.lastUpdated).toLocaleDateString()}</strong>
			</h2>
			<p className="mt-3">
				{description}
			</p>

			<hr className="my-6 mt-5" />

			<article className="prose">
				<MDXRemote
					source={source.content}
					components={components}
				/>
			</article>
		</main>
	)
}