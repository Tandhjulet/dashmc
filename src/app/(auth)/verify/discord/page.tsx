"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AwaitingVerification from "../AwaitingVerification";

export default async function Verify() {
	const session = await auth();
	if (session && session.user?.email && session.user.username) {
		const userExists = session.user.discordId;

		if (userExists) {
			redirect("/dashboard");
		} else {
			return (
				<AwaitingVerification
					callback={async () => {
						"use server";

						redirect("/dashboard");
					}}
					username={session.user.username}
					verify={"Discord"}
				/>
			)
		}
	} else {
		redirect("/login");
	}
}