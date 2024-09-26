import Image from "next/image";
import { HTMLAttributes, memo } from "react";
import { FaLock, FaQuestion } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";
import { SlGameController } from "react-icons/sl";

export const metadata = {
	title: 'DashMC | Hjem',
	description: 'DashMC er en minecraft server udviklet til spilleren. Vi står klar til at byde dig velkommen!',
}

const LIChip = memo(function Element(props: HTMLAttributes<HTMLLIElement>) {
	const {
		children,
		className,

		...rest
	} = props;

	return (
		<li {...rest} className={`${className} w-full rounded-3xl p-8 inline-block overflow-hidden`}>
			{children}
		</li>
	)
})

export default function Home() {
  return (
    <div className="flex flex-col mx-auto max-w-[1200px] items-center pt-32">
		<section id="hero" className="flex flex-col items-center">
			<a href="#" className="z-20">
				<h2 className="uppercase text-xl text-blue-600 font-bold">
					Se det seneste nyt
					<span className="inline-block">
					<FiArrowUpRight />
					</span>
				</h2>
			</a>
			<h1 className="text-7xl font-black text-gray-900 leading-[4rem] z-10">DashMC</h1>

			<div className="inline-flex mt-6 gap-6">
				<a href="#" className="py-4 px-7 rounded-full border border-gray-500 inline-flex items-center gap-4">
					<FaQuestion className="size-6" />
					
					<span className="font-semibold text-lg">
						Besøg forummet
					</span>
				</a>

				<a href="#" className="py-4 px-7 rounded-full bg-blue-600 inline-flex items-center gap-4">
					<MdStorefront className="size-6 text-white" />
					
					<span className="text-white font-semibold text-lg">
						Gå til butikken
					</span>
				</a>
			</div>

			<p className="my-6 text-sm text-center">
				<strong className="text-blue-600 font-semibold">DashMC.net</strong> er et minecraft servernetværk, der tilbyder både skyblock og kitpvp.
				<br />
				Vi er fortsat under udvikling, men vi åbner dørene <strong className="font-semibold text-blue-600">i efterårsferien</strong>!
			</p>
		</section>

		<Image
			alt="DashMC Logo"
			src={"/image.png"}
			width={1080}
			height={1080}

			className="z-20 pointer-events-none size-[750px] -mt-8 select-none"
		/>

		<section id="foryou" className="mt-20 flex flex-col items-center w-full">
			<h3 className="text-xl font-bold text-blue-700">
				HVORFOR OS?
			</h3>
			<h2 className="text-5xl font-bold text-gray-800 text-center">
				Vi genopfinder det klassiske
			</h2>
			
			<ul className="columns-2 gap-16 mt-12 w-full max-w-[1500px]">
				<LIChip className="bg-blue-700 h-[36rem] mb-10 relative">
					<h4 className="text-gray-300 font-semibold">VI GENFINDER GLÆDEN</h4>
					<h3 className="text-white font-bold text-4xl my-3">
						Vi hos DashMC tilbyder dig en nyfortolket version af old-school gamemodes - så du kan opleve nydelsen om igen!
					</h3>

					<SlGameController className="absolute size-[25rem] bottom-0 right-0 text-blue-400 translate-x-1/4 translate-y-1/4" />
				</LIChip>

				<LIChip className="h-[26rem] border-4 border-gray-300">
					<h4 className="text-gray-700 font-semibold">I TRYGGE HÆNDER</h4>
					<h3 className="text-gray-800 font-bold text-4xl my-3">
						Udviklingsholdet bag DashMC står med mange års teoretisk og praktisk erfaring - DashMC er ikke vores første hit!
					</h3>
				</LIChip>

				<LIChip className="h-[26rem] bg-gray-200 mb-10">
					<h4 className="text-gray-700 font-semibold">SKRÆDDERSYEDE SPILOPLEVELSER</h4>
					<h3 className="text-gray-800 font-bold text-3xl my-3">
						Vi stræber efter at vores spillere skal have den bedst mulige oplevelse, og vi er derfor altid åbne for idéer og forslag, der ofte vil implementeres. Vi lytter altid til jer!
					</h3>
				</LIChip>

				<LIChip className="bg-blue-700 h-[36rem] relative">
					<h4 className="text-gray-300 font-semibold">I SIKKERHED</h4>
					<h3 className="text-white font-bold text-4xl my-3">
						Vi indsamler ingen personlige oplysninger. Du kan være sikker på, at du og din data er i sikkerhed hos DashMC.
					</h3>

					<FaLock className="absolute size-[25rem] bottom-0 left-0 text-blue-400 -translate-x-1/4 translate-y-1/4 rotate-45" />
				</LIChip>
			</ul>
		</section>
	</div>
  );
}
