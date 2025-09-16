import Footer from "@/components/Footer"
import Header from "@/components/header/Header"
import React from "react"

export default function Layout({
	children,
  }: {
	children: React.ReactNode
  }) {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	)
  }