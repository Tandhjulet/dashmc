import Image from "next/image"
import React from "react"
import { IoArrowUndoSharp } from "react-icons/io5"

export default function Layout({
	children,
  }: {
	children: React.ReactNode
  }) {
	return (
		<div className="h-screen overflow-y-hidden flex flex-row py-4 lg:px-4 gap-6">
			<div className="w-1/2 rounded-2xl overflow-clip relative hidden lg:block">
				<Image
					src={"/background.png"}
					width={1355}
					height={959}
					alt="DashMC Logo"
					className="h-full aspect-square object-cover"
					priority
				/>
				
				<div className="bg-blue-600 h-full w-full" />

				<a
					href="/"
					className="px-4 py-1 bg-gray-800 absolute left-2 top-2 rounded-xl inline-flex gap-2 items-center opacity-90"
				>
					<IoArrowUndoSharp className="text-white" />
					<span className="text-white">Tilbage</span>
				</a>
			</div>

			<main className="my-auto lg:p-20 w-full lg:w-1/2 max-h-[calc(100%-5rem*2)]">
				{children}
			</main>
		</div>
	)
  }