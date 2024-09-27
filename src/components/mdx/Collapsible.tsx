import { IoChevronDown } from "react-icons/io5";

interface Props {
	title: string,
	children?: React.ReactNode,
}

export function Collapsible({
	title,
	children,
}: Props) {
	return (
		<details className="bg-gray-100 rounded-xl my-3 group select-text">
			<summary className="list-none inline-flex justify-between items-center w-full cursor-pointer p-3 ">
				<span className="text-lg font-bold text-blue-600">{title}</span>

				<span className="group-open:rotate-[90deg] transition-transform duration-150">
					<IoChevronDown className="size-5" />
				</span>
			</summary>
			<div className="p-3 pt-0 list-disc">
				<hr className="mb-3" />
				{children}
			</div>
		</details>
	)
}