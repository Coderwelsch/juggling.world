import { classNames } from "@/src/lib/class-names"
import { ReactNode } from "react"

export const PanelBody = ({
	className,
	children,
}: {
	className?: string
	children: ReactNode
}) => {
	return (
		<div
			className={classNames("pl-24 pr-16 flex flex-col mt-6", className)}
		>
			{children}
		</div>
	)
}
