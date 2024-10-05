"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { redirect } from "next/navigation";
import VerifyUsername from "./VerifyUsername";

export default async function Verify() {
	const session = await auth();
	if(session && session.user?.email) {
		const email = session.user.email;
		const userExists = await prisma.user
			.findFirst({
				where: {
					email: {
						equals: email
					}
				}
			});

		if(userExists) {
			redirect("/");
		} else {
			return <VerifyUsername callback={(res) => {
				"use server";
				if(res) {
					redirect("/");
				}
			}} />
		}
	} else {
		redirect("/login");
	}
}