import { Poppins } from 'next/font/google'
import type { Metadata } from "next";
import "./globals.css";
import { baseUrl } from "./sitemap";
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const poppins = Poppins({
	weight: ["500", "600", "700", "800", "900"],
	subsets: ["latin"],
})

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title: {
		default: "DashMC",
		template: "DashMC | %s"
	},
	description: "Generated by create next app",
	openGraph: {
		title: "DashMC",
		description: "Forsiden for DashMC.",
		url: baseUrl,
		siteName: "DashMC",
		locale: "da_DK",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-snippet": -1,
		}
	}
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${poppins.className} antialiased`}
			>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
