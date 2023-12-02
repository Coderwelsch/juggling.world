import { Headline } from "@/src/components/headline/headline"
import { classNames } from "@/src/lib/class-names"
import { ReactNode } from "react"

interface DialogHeaderProps {
	title: string | ReactNode
	children?: ReactNode
	className?: string
}

export const DialogHeader = ({
	title,
	children,
	className,
}: DialogHeaderProps) => {
	return (
		<div
			className={classNames(
				"flex flex-col items-center justify-between gap-3 text-slate-50 max-w-md text-center",
				className,
			)}
		>
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
