"use client";

import { HTMLAttributes, useCallback, useState } from "react";

export default function useModal() {
	const [shown, setShown] = useState<boolean>(false);

	const hideModal = useCallback(() => setShown(false), []);
	const showModal = useCallback(() => setShown(true), []);

	const Modal = useCallback((props: HTMLAttributes<HTMLDivElement>) => (
		shown &&
		<div
			className="top-0 left-0 absolute w-screen h-screen flex justify-center items-center"
		>
			<div
				className="top-0 left-0 absolute w-screen h-screen bg-gray-600/5 backdrop-grayscale z-40"
				onClick={() => {
					setShown(false);
				}}
			/>

			<div
				{...props}
				className={`bg-[#121212] p-4 rounded-md ${props.className} z-50`}
				onClick={(e) => {
					e.stopPropagation();
					if(props.onClick)
						props?.onClick(e)
				}}
			>
				{props.children}
			</div>
		</div>
	), [shown])

	return {
		hideModal,
		showModal,
		Modal
	}
}