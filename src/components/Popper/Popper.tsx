interface Props {
	children?: React.ReactNode;
	popover?: React.ReactNode;
	direction?: "up" | "down";
}

export default function Popper(props: Props) {
	const {
		children,
		popover,
		direction = "down",
	} = props;

	return (
		<div className="relative group/popper">

			{children}
			{/* Pretty hacky, but its the simplest way to make group hover still work whilst offsetting the popper. */}
			<div className={`${direction === "up" && "absolute top-0"} w-full h-1`} />

			<div className={`${direction === "down" ? "-translate-x-1" : "-translate-y-[calc(100%-0.25rem)] top-0 right-0"} absolute group-hover/popper:block hidden border border-gray-300 bg-white rounded-lg dark:bg-[#121212] dark:border-gray-800`}>
				{popover}
			</div>
		</div>
	)
}