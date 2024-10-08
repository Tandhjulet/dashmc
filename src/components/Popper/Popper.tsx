interface Props {
	children?: React.ReactNode;
	popover?: React.ReactNode;
}

export default function Popper(props: Props) {
	const {
		children,
		popover,
	} = props;

	return (
		<div className="relative group">
			{children}

			{/* Pretty hacky, but its the simplest way to make group hover still work whilst offsetting the popper. */}
			<div className="w-full h-1 -mb-1" />

			<div className="absolute group-hover:block hidden border border-gray-300 bg-white rounded-lg translate-y-1 -translate-x-1 dark:bg-[#121212] dark:border-gray-800">
				{popover}
			</div>
		</div>
	)
}