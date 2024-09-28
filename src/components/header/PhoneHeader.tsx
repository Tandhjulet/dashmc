"use client";

import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { RiMenu3Fill } from "react-icons/ri";

export default function PhoneHeader() {
	const [ show, setShow ] = useState(false);

	return (
		<>
			<button
				className="mr-6"
				onClick={() => setShow(prev => !prev)}
				aria-hidden={!show}
			>
				<RiMenu3Fill className="size-6 text-gray-800 z-50" />
			</button>

			{show && (
				<div className="flex flex-col w-screen h-screen absolute top-0 z-40 bg-white">
					<div className="h-20 w-full flex items-center justify-end">
						<button
							className="mr-6"
							onClick={() => setShow(prev => !prev)}
							aria-hidden={show}
						>
							<IoClose className="size-6 text-gray-800 z-50" />
						</button>
					</div>

					<ul className="p-4 font-semibold text-xl">
						<li className="w-full border-b py-4">
							<a href="https://butik.dashmc.net/" target="_blank">
								Butik
								<span className="inline-block">
									<FiArrowUpRight className="size-3 mb-1" />
								</span>
							</a>
						</li>
						<li className="w-full border-b py-4">
							<a href="https://forum.dashmc.net/" target="_blank">
								Forum
								<span className="inline-block">
									<FiArrowUpRight className="size-3 mb-1" />
								</span>
							</a>
						</li>
						<li className="w-full border-b py-4">
							<a href="/rules">
								Regler
							</a>
						</li>
					</ul>

					<div className="grow" />
					
					<span className="p-4">
						<strong className="text-gray-800">DashMC</strong> &copy; 2024. Alle rettigheder forbeholdes
					</span>
				</div>
			)}
		</>
	)
}