"use client";

import {  HTMLAttributes, memo, useMemo } from "react";
import { IconType } from "react-icons/lib";
import * as Icons from './icons/index'
import Popper from "../Popper/Popper";

type IconPack = () => {[id: string]: IconType};

export default function useIconPicker({
	onSelect,
} : {
	onSelect?: (iconKey: string) => void;
}) {
	const allIcons: {[id: string]: IconType} = useMemo(() => {
		let loadedIcons = {};

		const { ...IconList } = Icons;
		for(const key of Object.keys(IconList)) {
			const { ...Icons } = IconList[key as keyof typeof IconList]();
			
			loadedIcons = {
				...loadedIcons,
				...Icons,
			};			
		}

		return loadedIcons;
	}, []);

	const Icon = memo(function Icon(props: {
		iconKey: string;
	} & HTMLAttributes<HTMLButtonElement>) {
		const {
			iconKey,
			className,

			...rest
		} = props;

		const Icon = allIcons[iconKey];

		return (
			<button
				onClick={() => {
					if(onSelect)
						onSelect(iconKey)
				}}
				className={`p-2 ${className}`}
				{...rest}
			>
				<Icon className="size-6" />
			</button>
		)
	});

	const IconPicker = ({
		selectedIcon = "FaUser",
	}: {
		selectedIcon?: string;
	}) => {
		return (
			<div>
				<Popper
					popover={(
						<div className="thin-scrollbar p-2 grid grid-cols-4 items-center size-[200px] overflow-y-scroll gap-2">
							{Object.keys(allIcons).map((icon, i) => (
								<Icon
									className="size-6"
									iconKey={icon}
									key={i}
								/>
							))}
						</div>
					)}
					direction="up"
				>
					<div className="flex flex-row items-center gap-1 py-1 overflow-hidden max-w-full">
						<Icon
							iconKey={selectedIcon}
							className="mt-1"
							onClick={undefined}
						/>
						<span className="text-xs text-gray-600 dark:text-gray-400">
							Dit valgte ikon er
							<br />
							<span className="text-black dark:text-white text-base">
								{selectedIcon}
							</span>
						</span>
					</div>
				</Popper>
			</div>
		)
	}

	return {
		allIcons,
		IconPicker,
		Icon
	}
}

export async function loadSpecificIcon(iconKey: string): Promise<IconType | undefined> {
	const [type] = iconKey.split(/(?=[A-Z])/);
	try {
		const foundModule: IconPack = await import('./icons/' + type.toLocaleLowerCase())
		const iconPack = foundModule();
		return iconPack[iconKey];
	} catch {
		console.error("An error occured whilst trying to load icon", iconKey);
	}
	return undefined;
}