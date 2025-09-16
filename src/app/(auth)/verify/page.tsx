"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import VerifyUsername from "./VerifyUsername";
import { baseUrl } from "@/app/sitemap";

export default async function Verify(
	props: {
		searchParams?: Promise<{ [key: string]: string }>;
	}
) {
	const searchParams = await props.searchParams;
	const session = await auth();
	if (session && session.user?.email) {
		const userExists = session.user.username;

		if (userExists) {
			redirect("/");
		} else {
			return (
				<VerifyUsername
					callback={async (res) => {
						"use server";
						if (res.exists) {
							// Ensures redirects can only happen to local pages
							redirect(new URL(
								decodeURIComponent((searchParams?.prevUrl) ?? "/"),
								baseUrl,
							).pathname);
						} else {
							redirect("/verify");
						}
					}
					} />
			)
		}
	} else {
		redirect("/login");
	}
}