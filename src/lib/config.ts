import fs from "fs/promises";
import path from "path";
import { unstable_cache } from "next/cache";

const filePath = path.join(
	process.cwd(),
	"data",
	"motd.json"
);

const defaultConfig = {
	motd: `VI ÅBNER DEN 25. OKTOBER`,
	description: `<strong style="color:#2563eb;font-weight:600;">DashMC.net</strong> er et minecraft servernetværk, der tilbyder skyblock. <br />Vi er fortsat under udvikling, men vi åbner dørene <strong style="color:#2563eb;font-weight:600;">d. 25 oktober</strong>!`,
};

async function loadConfig() {
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

export async function saveConfig(data: {
	motd: string;
	description: string;
}) {
	await fs.writeFile(
		filePath,
		JSON.stringify(data, null, 2)
	);
}
