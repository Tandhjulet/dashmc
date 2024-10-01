"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ChangeTheme() {
	const { setTheme, theme } = useTheme();
	const [ mounted, setMounted ] = useState(false);
	
	useEffect(() => {
		setMounted(true);
	}, [])

	if(!mounted) 
		return (
			<button className="size-6" />
		)
	

	return (
		<button onClick={() => {
			setTheme(theme === "dark" ? "light" : "dark");
		}}>
			{theme === "dark" ? (
				<FiMoon className="size-6 text-gray-200" />
			) : (
				<FiSun className="size-6 text-gray-800" />
			)}
		</button>
	)
}