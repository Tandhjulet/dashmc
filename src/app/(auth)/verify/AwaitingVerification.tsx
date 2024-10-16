"use client";

import { OTPCode } from "@/app/api/verify/code/route";
import { useSession } from "next-auth/react";
import React from "react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { RxReload } from "react-icons/rx";

const CharChip = memo(function CharChip({
	letter,
}: {
	letter: string,
}) {
	if(letter === ".") {
		return (
			<span className="h-[100px] dark:bg-gray-800/30 dark:border-gray-800/20 dark:text-gray-100 text-center basis-0 grow text-5xl font-black py-6 bg-gray-100 border-2 border-gray-300 m-1 rounded-lg text-gray-900">
				&zwnj;
			</span>
		)
	}

	return (
		<span className="dark:bg-gray-800/30 dark:border-gray-800/20 dark:text-gray-100 text-center basis-0 grow text-5xl font-black py-6 bg-gray-100 border-2 border-gray-300 m-1 rounded-lg text-gray-900">
			{letter}
		</span>
	)
})

interface DiscordVerify {
	callback: (success: OTPCode & {exists: true} | {exists: false}) => void;
	username: string;

	verify: "Discord";
}

interface MinecraftVerify {
	callback: (success: OTPCode & {exists: true} | {exists: false}) => void;
	username: string;

	verify: "Minecraft"
}

type Props = DiscordVerify | MinecraftVerify;

export default function AwaitingVerification({
	callback,
	username,
	verify,
}: Props) {
	const { update } = useSession();

	const [timer, setTimer] = useState(10*60);
	const [code, setCode] = useState<string[]>(new Array(6).fill("."));

	const generateCode = useCallback(async () => {
		const body = JSON.stringify({
			username,
			verify,
		})

		const res: OTPCode = await (await fetch("/api/verify/code", {
			method: "POST",
			body,
		})).json()

		setCode(res.code.padStart(6, "0").split(""));
		setTimer(10*60);
	}, [username, verify]);

	useEffect(() => {
		generateCode();

		const intervalId = setInterval(() => {
			setTimer((prev) => {
				if(prev === 0) {
					clearInterval(intervalId);
					callback({
						exists: false,
					});
					return 0;
				}
				return prev-1;
			});
		}, 1000);

		return () => clearInterval(intervalId);
	}, [callback, generateCode]);

	useEffect(() => {
		async function checkIfVerified() {
			const res: OTPCode & {exists: true} | {exists: false} = await (await fetch("/api/verify/code", {
					method: "PATCH",
					body: JSON.stringify({ code: code.join(""), verify })
				}
			)).json();

			if(res?.exists === true && res?.hasBeenVerified === true) {
				await update({
					code: res.code,
					uuid: res.uuid!,
					verify,
				});
				callback(res);
			}
		}

		const intervalId = setInterval(() => checkIfVerified(), 2500);
		return () => clearInterval(intervalId);
	}, [code, callback, update, verify])

	const countdown = useMemo(() => {
		const minutes = Math.floor(timer / 60).toString();
		const seconds = (timer % 60).toString();

		return `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`
	}, [timer]);

	return (
		<div className="w-full flex flex-col items-center justify-center mb-[8rem] text-center px-2">
			<AiOutlineLoading className="size-32 text-blue-600 mb-6 animate-spin" />
			<h1 className="text-3xl font-bold text-gray-800 mt-10 dark:text-gray-200">
				Skriv verifikationskoden i {verify}
			</h1>
			<p className="text-center dark:text-gray-200">
				{verify === "Minecraft" ? (
					<>
						Ved at udføre dette tilkobler du minecraft-kontoen
						<br />
						<strong className="font-black text-blue-600 dark:text-blue-700">{username}</strong> til din profil.
					</>
				) : (
					<>
						Ved at udføre dette tilkobler du din konto (<strong className="font-black text-blue-600 dark:text-blue-700">{username}</strong>)
						til din discord-konto.
					</>
				)}
				
				{" "}
				<button
					className="text-blue-600 underline dark:text-blue-600"
					onClick={() => callback({
						exists: false,
					})}
				>
					Har du fortrudt?
				</button>
			</p>
			
			<p className="mt-6 mb-1">
				Benyt{" "}
				<button
					className="hover:bg-gray-900 ring-0 bg-gray-800 dark:hover:bg-gray-800 dark:bg-gray-800/40 text-white px-2 py-[0.3rem] rounded-md font-mono active:scale-95 active:!bg-blue-600 transition-[background-color]"
					onClick={() => {
						navigator.clipboard.writeText("/verify " + code.join(""));
					}}
				>
					/verify {" "}
					{code[0] === "." ? (
						<RxReload className="inline text-gray-400 animate-spin" />
					) : code.join("")}
				</button>
			</p>

			<div className="w-[500px] my-2 hidden phone:inline-flex">
				{code.map((char, i) => <CharChip letter={char} key={i} />)}
			</div>

			<p className="max-w-[500px] text-center">
				Din kode udløber om <strong className="dark:text-gray-200">{countdown}</strong>.
			</p>
		</div>
	)
}