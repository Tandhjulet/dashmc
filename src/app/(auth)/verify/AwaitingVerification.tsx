import { memo, useEffect, useMemo, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { IoReload } from "react-icons/io5";

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

export default function AwaitingVerification() {
	const [timer, setTimer] = useState(10*60);

	useEffect(() => {
		setTimer(10*60);

		const intervalId = setInterval(() => {
			setTimer((prev) => prev-1);
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	const countdown = useMemo(() => {
		const minutes = Math.floor(timer / 60).toString();
		const seconds = (timer % 60).toString();

		return `${minutes.padStart(2, "0")}:${seconds.padEnd(2, "0")}`
	}, [timer]);

	const code = "012345".split('');

	return (
		<div className="w-full flex flex-col items-center justify-center mb-[8rem]">
			<AiOutlineLoading className="size-32 text-blue-600 mb-6 animate-spin" />
			<h1 className="text-3xl font-bold text-gray-800 mt-10">
				Skriv verifikationskoden i Minecraft
			</h1>
			<p className="text-center">
				Ved at udføre dette tilkobler du minecraft-kontoen
				<br />
				<strong className="font-black text-blue-600">Tandhjulet</strong> til din profil.{" "}
				<button className="text-blue-600 underline">
					Har du fortrudt?
				</button>
			</p>
			
			<p className="mt-6 mb-1">
				Benyt <code className="bg-gray-800 text-white p-2 rounded-md">/verify {code.join("")}</code>
			</p>

			<div className="inline-flex w-[500px] my-2">
				{code.map((char, i) => <CharChip letter={char} key={i} />)}
			</div>

			<p className="max-w-[500px] text-center">
				Din kode udløber om <strong>{countdown}</strong>.
				<br />
				<button className="text-blue-600 underline text-sm">
					<IoReload className="inline mr-1" />
					Anmod om en ny
				</button>
			</p>
			
			
		</div>
	)
}