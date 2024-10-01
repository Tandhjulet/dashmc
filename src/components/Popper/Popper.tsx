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

			<div className="absolute group-hover:block hidden border border-gray-300 bg-white rounded-lg -translate-x-1">
				{popover}
			</div>
		</div>
	)
}