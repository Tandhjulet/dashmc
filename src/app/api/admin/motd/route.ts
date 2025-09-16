import { auth } from "@/auth";
import { saveConfig } from "@/lib/config";
import { Role } from "@prisma/client";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
	const {
		motd,
		description,
	}: {
		motd: string;
		description: string;
	} = await req.json();

	const session = await auth();
	if (session?.user?.role !== Role.ADMIN) {
		return Response.json(
			{ success: false },
			{
				status: 401,
			}
		);
	}

	const window = new JSDOM("").window;
	const DOMPurify = createDOMPurify(window);
	const cleanDescription =
		DOMPurify.sanitize(description);
	const cleanMotd = DOMPurify.sanitize(motd);

	const conf = {
		motd: cleanMotd,
		description: cleanDescription,
	};

	await saveConfig(conf);
	revalidateTag("motd");

	return Response.json(conf);
}
