import { HTMLAttributes } from "react";

export function Ol(props: HTMLAttributes<HTMLOListElement>) {
	const {
		className,
		children,

		...rest
	} = props;

	return (
		<ol {...rest} className={`${className} list-inside list-disc ml-3 rule`}>
			{children}
		</ol>
	)
}