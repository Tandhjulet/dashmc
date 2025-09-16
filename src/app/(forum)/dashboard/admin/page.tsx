"use server";

import { getConfig } from "@/app/api/admin/motd/route";
import MotdEditor from "./MotdEditor";
import UserEditor from "./UserEditor";

export default async function Page() {
	const config = await getConfig();

	return (
		<div className="flex flex-col gap-4 m-4">
			<MotdEditor currMotd={config.motd} currDesc={config.description} />
			<UserEditor></UserEditor>
		</div>
	);
}