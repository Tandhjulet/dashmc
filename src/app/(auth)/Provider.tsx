"use client";

import { HTMLAttributes, memo, useMemo } from "react";
import { signIn } from "next-auth/react"
import { BsDiscord, BsGoogle, BsQuestionLg } from "react-icons/bs";

interface Props {
	providerType: string,
	providerName: string;
}

export const Provider = memo(function Provider(props: Props & HTMLAttributes<HTMLButtonElement>) {
	const {
		providerName,
		providerType,
		onClick,

		...rest
	} = props;

	const Icon = useMemo(() => {
		switch(providerType) {
			case "google":
				return BsGoogle;
			case "discord":
				return BsDiscord;
			default:
				return BsQuestionLg;
		}
	}, [providerType])

	return (
		<button
			{...rest}
			className="dark:border-gray-500 px-4 py-3 inline-flex gap-2 justify-center items-center border-gray-800 border rounded-lg w-full text-lg"
			onClick={(e) => {
				if(onClick)
					onClick(e);

				signIn(providerType, { redirectTo: "/verify" });
			}}
		>
			<Icon className="size-6" />
			{providerName}
		</button>
	)
})