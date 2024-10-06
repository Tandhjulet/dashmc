import { readRules } from "@/lib/mdx";
import { MetadataRoute } from "next";

export const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://dashmc.net";

export default function sitemap(): MetadataRoute.Sitemap {
	let rulesLastEdited = new Date();
	try {
		rulesLastEdited = new Date(readRules().data.lastUpdated);
	} catch {}

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			priority: 1,
		},
		{
			url: baseUrl + "/rules",
			lastModified: rulesLastEdited,
			priority: 0.2,
		}
	]
}