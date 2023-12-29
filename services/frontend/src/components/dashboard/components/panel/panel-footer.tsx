import { classNames } from "@/src/lib/class-names"
import { ReactNode } from "react"

export const PanelFooter = ({
	className,
	children,
}: {
	className?: string
	children: ReactNode
}) => {
	return (
		<div
			className={classNames(
				"mt-8 flex flex-row items-center justify-center gap-4",
				className,
			)}
		>
			{children}
		</div>
	)
}
