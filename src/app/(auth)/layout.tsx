import React from "react"
import { IoArrowUndoSharp } from "react-icons/io5"

export default function Layout({
	children,
  }: {
	children: React.ReactNode
  }) {
	return (
		<div className="h-screen overflow-y-hidden flex flex-row p-4 gap-6">
			<div className="w-1/2 rounded-2xl overflow-clip relative">
				<div className="bg-blue-600 h-full w-full" />

				<a
					href="/"
					className="px-4 py-1 bg-gray-800 absolute left-2 top-2 rounded-xl inline-flex gap-2 items-center opacity-90"
				>
					<IoArrowUndoSharp className="text-white" />
					<span className="text-white">Tilbage</span>
				</a>
			</div>

			<div className="my-auto p-20 w-1/2 max-h-[calc(100%-5rem*2)]">
				{children}
			</div>
		</div>
	)
  }