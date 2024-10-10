export function slugify(str: string) {
	return encodeURIComponent(str
			.toLowerCase()
			.trim()
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-"))
}