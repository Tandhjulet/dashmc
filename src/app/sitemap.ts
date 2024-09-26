import { MetadataRoute } from "next";

export const baseUrl = "http://128.0.10.23:80";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			priority: 1,
		}
	]
}