export function slugify(str: string) {
	return encodeURIComponent(
		str
			.toLowerCase()
			.trim()
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
	);
}

export function parseDate(date: string | Date) {
	if (typeof date === "string") date = new Date(date);

	return date.toLocaleDateString("da-DK", {
		year: "numeric",
		month: "short",
		day: "2-digit",
	});
}
