import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";

const CharChip = memo(function CharChip({
	letter,
}: {
	letter: string,
}) {
	return (
		<span className="text-center basis-0 grow text-5xl font-black py-6 bg-gray-100 border-2 border-gray-300 m-1 rounded-lg text-gray-900">
			{letter}
		</span>
	)
})

export default function AwaitingVerification({
	callback,
	username,
}: {
	callback: (success: boolean) => void;
	username: string;
}) {
	const [timer, setTimer] = useState(10*60);
	const [code, setCode] = useState<string[]>(new Array(6).fill("."));

	const generateNewCode = useCallback(() => {
		const newCode = Math.floor(Math.random()*(10**6)).toString();
		setCode(newCode.padStart(6, "0").split(""));
		setTimer(10*60);
	}, []);

	useEffect(() => {
		generateNewCode();
		setTimer(10*60);

		const intervalId = setInterval(() => {
			setTimer((prev) => {
				if(prev === 0) {
					clearInterval(intervalId);
					callback(false);
					return 0;
				}
				return prev-1;
			});
		}, 1000);

		return () => clearInterval(intervalId);
	}, [callback, generateNewCode]);

	const countdown = useMemo(() => {
		const minutes = Math.floor(timer / 60).toString();
		const seconds = (timer % 60).toString();

		return `${minutes.padStart(2, "0")}:${seconds.padEnd(2, "0")}`
	}, [timer]);

	return (
		<div className="w-full flex flex-col items-center justify-center mb-[8rem]">
			<AiOutlineLoading className="size-32 text-blue-600 mb-6 animate-spin" />
			<h1 className="text-3xl font-bold text-gray-800 mt-10">
				Skriv verifikationskoden i Minecraft
			</h1>
			<p className="text-center">
				Ved at udføre dette tilkobler du minecraft-kontoen
				<br />
				<strong className="font-black text-blue-600">{username}</strong> til din profil.{" "}
				<button
					className="text-blue-600 underline"
					onClick={() => callback(false)}
				>
					Har du fortrudt?
				</button>
			</p>
			
			<p className="mt-6 mb-1">
				Benyt{" "}
				<button
					className="hover:bg-gray-900 ring-0 bg-gray-800 text-white px-2 py-[0.3rem] rounded-md font-mono active:scale-95 active:bg-blue-600 transition-[background-color]"
					onClick={() => {
						navigator.clipboard.writeText("/verify " + code.join(""));
					}}
				>
					/verify {code.join("")}
				</button>
			</p>

			<div className="inline-flex w-[500px] my-2">
				{code.map((char, i) => <CharChip letter={char} key={i} />)}
			</div>

			<p className="max-w-[500px] text-center">
				Din kode udløber om <strong>{countdown}</strong>.
			</p>
			
			
		</div>
	)
}