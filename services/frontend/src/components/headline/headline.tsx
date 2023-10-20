import { classNames } from "@/src/lib/class-names"
import { ReactNode } from "react"


const headlineSizes = {
	1: "text-4xl",
	2: "text-3xl",
	3: "text-2xl",
	4: "text-lg",
	5: "text-md",
	6: "text-sm",
}

interface HeadlineProps extends React.HTMLAttributes<HTMLHeadingElement> {
	children: ReactNode
	size?: 1 | 2 | 3 | 4 | 5 | 6
	className?: string
	renderAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

export const Headline = ({
	children,
	className,
	size = 1,
	renderAs = "h1",
	...props
}: HeadlineProps) => {
	const HeadingSize = renderAs ? renderAs : (`h${size}` as const)
	const tailwindSize = headlineSizes[size]

	return (
		<HeadingSize
			className={classNames(
				"text-3xl font-semibold",
				tailwindSize,
				className,
			)}
			{...props}
		>
			{children}
		</HeadingSize>
	)
}
