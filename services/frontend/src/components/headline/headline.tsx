import { classNames } from "@/src/lib/class-names"
import { ReactNode } from "react"

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

	return (
		<HeadingSize
			className={classNames(
				"text-3xl font-bold text-neutral-100",
				className,
			)}
			{...props}
		>
			{children}
		</HeadingSize>
	)
}
