import React from "react"
import VerticalNavbar from "./VerticalNavbar"
import { unstable_cache } from "next/cache";
import { Form } from "@/lib/forms/Form";

export const getAllForms = unstable_cache(
	async () => {
		const form = await Form.getAllForms();
		return form;
	}, [],
	{ revalidate: false, tags: ['form'] }
)


export default async function Layout({
	children,
  }: {
	children: React.ReactNode
  }) {
	const forms = await getAllForms();

	return (
		<>
			<VerticalNavbar forms={forms} />

			<div className="max-sm:pt-[80px] sm:pl-[100px] xl:pl-[300px] w-full h-full z-30 rounded-tl-3xl">
				{children}
			</div>
		</>
	)
  }