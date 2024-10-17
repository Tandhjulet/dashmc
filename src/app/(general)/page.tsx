import Image from "next/image";
import { HTMLAttributes, memo } from "react";
import { FaLock } from "react-icons/fa6";
import { IoGameController } from "react-icons/io5";
import { MdStorefront } from "react-icons/md";
import { PiChatsCircleDuotone } from "react-icons/pi";

export const metadata = {
	title: 'Hjem',
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
    <main className="flex flex-col mx-auto max-w-[1250px] items-center pt-32 xl:px-6">
		<section id="hero" className="flex flex-col items-center">
			<a href="#" className="z-20">
				<h2 className="uppercase text-xl text-blue-600 font-bold">
					VI ÅBNER DEN 25. OKTOBER
				</h2>
			</a>
			<h1 className="dark:text-gray-100 text-7xl font-black text-gray-900 leading-[4rem] z-10">DashMC</h1>

			<div className="flex flex-col md:flex-row mt-6 gap-3 md:gap-6 whitespace-nowrap">
				<a href="https://dashmc.net/dashboard" className="py-4 px-7 rounded-full border border-gray-800 inline-flex items-center gap-4">
					<PiChatsCircleDuotone className="size-6 shrink-0 dark:text-gray-400" />
					
					<span className="font-semibold text-lg dark:text-white">
						Besøg forummet
					</span>
				</a>

				<a href="https://butik.dashmc.net/" className="py-4 px-7 rounded-full bg-blue-600 inline-flex items-center gap-4">
					<MdStorefront className="size-6 text-white shrink-0" />
					
					<span className="text-white font-semibold text-lg">
						Gå til butikken
					</span>
				</a>
			</div>

			<p className="my-6 text-sm text-center max-w-[80%] md:max-w-full dark:text-white">
				<strong className="text-blue-600 font-semibold">
					DashMC.net
				</strong> er et minecraft servernetværk, der tilbyder skyblock.{" "}
				<br className="hidden md:block" />
				Vi er fortsat under udvikling, men vi åbner dørene <strong className="font-semibold text-blue-600">d. 25 oktober</strong>!
			</p>
		</section>

		<Image
			alt="DashMC Logo"
			src={"/image.png"}
			width={1080}
			height={1080}

			className="z-20 pointer-events-none size-[750px] -mt-8 select-none object-contain h-fit"
			priority
		/>

		<section id="foryou" className="mt-20 flex flex-col items-center w-full">
			<h3 className="text-xl font-bold text-blue-700">
				HVORFOR OS?
			</h3>
			<h2 className="dark:text-white text-4xl phone:text-5xl font-bold text-gray-800 text-center phone:px-6">
				Vi genopfinder det klassiske
			</h2>
			
			<ul className="columns-1 md:columns-2 gap-8 xl:gap-16 mt-6 phone:mt-12 w-full max-w-[90%] md:max-w-[1500px]">
				<LIChip className="bg-blue-700 md:h-[36rem] mb-10 relative pb-32 md:pb-0">
					<h4 className="text-gray-300 font-semibold">VI GENFINDER GLÆDEN</h4>
					<h3 className="text-white font-bold text-3xl lg:text-4xl my-3 relative z-10">
						Vi hos DashMC tilbyder dig en nyfortolket version af old-school gamemodes - så du kan opleve nydelsen om igen!
					</h3>

					<IoGameController className="absolute size-[25rem] bottom-0 right-0 text-blue-400 translate-x-1/4 translate-y-1/4 rotate-[315deg] z-0" />
				</LIChip>

				<LIChip className="md:h-[26rem] border-4 border-gray-300 mb-10 md:mb-0 dark:border-gray-800/50">
					<h4 className="text-gray-700 font-semibold dark:text-gray-500">I TRYGGE HÆNDER</h4>
					<h3 className="text-gray-800 font-bold text-3xl lg:text-4xl my-3 dark:text-gray-200">
						Udviklingsholdet bag DashMC står med mange års teoretisk og praktisk erfaring - DashMC er ikke vores første hit!
					</h3>
				</LIChip>

				<LIChip className="md:h-[26rem] bg-gray-200 mb-10 dark:bg-gray-800/50">
					<h4 className="text-gray-700 font-semibold dark:text-gray-500">SKRÆDDERSYEDE SPILOPLEVELSER</h4>
					<h3 className="text-gray-800 font-bold text-2xl phone:text-[1.8rem] my-3 dark:text-gray-200">
						Vi stræber efter at vores spillere skal have den bedst mulige oplevelse, og vi er derfor altid åbne for idéer og forslag, der ofte vil implementeres. Vi lytter altid til jer!
					</h3>
				</LIChip>

				<LIChip className="bg-blue-700 md:h-[36rem] relative pb-28 md:pb-0">
					<h4 className="text-gray-300 font-semibold">I SIKKERHED</h4>
					<h3 className="text-white font-bold text-3xl lg:text-4xl my-3 z-10 relative">
						Vi indsamler ingen personlige oplysninger. Du kan være sikker på, at dig og dine data er i sikkerhed hos DashMC.
					</h3>

					<FaLock className="absolute size-[25rem] bottom-0 left-0 text-blue-400 -translate-x-1/4 translate-y-1/4 rotate-45 z-0" />
				</LIChip>
			</ul>
		</section>
	</main>
  );
}
