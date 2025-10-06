"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import VerifyUsername from "./VerifyUsername";

export default async function Verify() {
	const session = await auth();
	if (session && session.user?.email) {
		const userExists = session.user.username;

		if (userExists) {
			redirect("/");
		} else {
			return (
				<VerifyUsername />
			)
		}
	} else {
		redirect("/login");
	}
}