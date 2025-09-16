import { auth } from "@/auth";
import { Role } from "@prisma/client";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import fs from "fs/promises";
import path from "path";
import { unstable_cache, revalidateTag } from "next/cache";

const filePath = path.join(
	process.cwd(),
	"data",
	"motd.json"
);

const defaultConfig = {
	motd: `VI ÅBNER DEN 25. OKTOBER`,
	description: `<strong style="color:#2563eb;font-weight:600;">DashMC.net</strong> er et minecraft servernetværk, der tilbyder skyblock. <br />Vi er fortsat under udvikling, men vi åbner dørene <strong style="color:#2563eb;font-weight:600;">d. 25 oktober</strong>!`,
};

export async function loadConfig() {
	try {
		const file = await fs.readFile(filePath, "utf-8");
		return JSON.parse(file);
	} catch (err: unknown) {
		const error = err as { code: string };

		if (error.code === "ENOENT") {
			// create directory if missing
			await fs.mkdir(path.dirname(filePath), {
				recursive: true,
			});
			// write default config
			await fs.writeFile(
				filePath,
				JSON.stringify(defaultConfig, null, 2),
				"utf-8"
			);
			return defaultConfig;
		}
		throw err; // rethrow other errors
	}
}

export const getConfig = unstable_cache(
	loadConfig,
	["motd-config"],
	{
		tags: ["motd"],
	}
);

async function saveConfig(data: {
	motd: string;
	description: string;
}) {
	await fs.writeFile(
		filePath,
		JSON.stringify(data, null, 2)
	);
	revalidateTag("motd");
}

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

	return Response.json(conf);
}
