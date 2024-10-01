import React from "react"

export default function Layout({
	children,
  }: {
	children: React.ReactNode
  }) {
	return (
		<div className="h-screen overflow-y-hidden flex flex-row p-4 gap-6">
			<div className="w-1/2 rounded-2xl overflow-clip">
				<div className="bg-blue-600 h-full w-full" />
			</div>

			<div className="my-auto p-20 w-1/2 max-h-[calc(100%-5rem*2)]">
				{children}
			</div>
		</div>
	)
  }