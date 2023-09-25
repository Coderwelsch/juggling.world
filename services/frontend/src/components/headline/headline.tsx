import { classNames } from "@/src/lib/class-names"
import { ReactNode } from "react"

const headlineSizes = {
	1: "text-3xl",
	2: "text-2xl",
	3: "text-xl",
	4: "text-lg",
	5: "text-md",
	6: "text-sm",
}

interface HeadlineProps extends React.HTMLAttributes<HTMLHeadingElement> {
	children: ReactNode
	size?: 1 | 2 | 3 | 4 | 5 | 6
	className?: string
}

export const Headline = ({
	children,
	className,
	size = 1,
	...props
}: HeadlineProps) => {
	const HeadingSize = `h${size}` as const
	const tailwindSize = headlineSizes[size]

	return (
		<HeadingSize
			className={classNames(
				"text-3xl font-semibold",
				className,
				tailwindSize,
			)}
			{...props}
		>
			{children}
		</HeadingSize>
	)
}
