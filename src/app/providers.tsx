"use client";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export default function Providers({
	children,
	session
}: {
	children: React.ReactNode,
	session?: Session | null;
}) {
	return (
		<SessionProvider
			refetchOnWindowFocus={false}
			refetchWhenOffline={false}
			session={session}
		>
			<ThemeProvider attribute='class'>
				{children}
			</ThemeProvider>
		</SessionProvider>
	)
}