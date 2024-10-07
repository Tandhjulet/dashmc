"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import VerifyUsername from "./VerifyUsername";
import { baseUrl } from "@/app/sitemap";

export default async function Verify({
	searchParams
}: {
	searchParams?: { [key: string]: string };
}) {
	const session = await auth();
	if(session && session.user?.email) {
		const userExists = session.user.username;

		if(userExists) {
			redirect("/");
		} else {
			return <VerifyUsername callback={(res) => {
				"use server";
				if(res.exists) {
					// Ensures redirects can only happen to local pages
					redirect(new URL(
						decodeURIComponent((searchParams?.prevUrl) ?? "/"),
						baseUrl,
					).pathname);
				}
			}} />
		}
	} else {
		redirect("/login");
	}
}