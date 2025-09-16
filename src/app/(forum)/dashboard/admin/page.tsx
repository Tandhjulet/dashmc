"use server";

import { getConfig } from "@/app/api/admin/motd/route";
import MotdEditor from "./MotdEditor";

export default async function Page() {
	const config = await getConfig();

	return (
		<main>
			<MotdEditor currMotd={config.motd} currDesc={config.description} />
		</main>
	);
}