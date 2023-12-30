import { Headline } from "@/src/components/headline/headline"
import { classNames } from "@/src/lib/class-names"
import { JSXElementConstructor, ReactNode, SVGProps } from "react"

interface DialogHeaderProps {
	title: string | ReactNode
	Icon?: JSXElementConstructor<SVGProps<SVGSVGElement>>
	iconClassName?: string
	children?: ReactNode
	className?: string
}

export const DialogHeader = ({
	title,
	Icon,
	iconClassName,
	children,
	className,
}: DialogHeaderProps) => {
	return (
		<div
			className={classNames(
				"flex flex-col items-center justify-between gap-3 text-neutral-50 max-w-md text-center",
				className,
			)}
		>
			{Icon ? (
				<Icon className={classNames("h-14 w-14", iconClassName)} />
			) : null}

			{typeof title === "string" ? (
				<Headline
					size={2}
					renderAs={"h2"}
				>
					{title}
				</Headline>
			) : (
				title
			)}

			{children}
		</div>
	)
}
