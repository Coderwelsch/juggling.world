import { classNames } from "@/src/lib/class-names"
import React, { forwardRef } from "react"

interface SearchFieldResultContainerProps
	extends React.HTMLProps<HTMLDivElement> {}

export const SearchFieldResultContainer = ({
	className,
	children,
	...props
}: SearchFieldResultContainerProps) => {
	return (
		<div
			tabIndex={-1}
			className={classNames(
				`absolute top-full mt-1 left-0 right-0 overflow-scroll max-h-96 flex flex-col gap-0 bg-slate-800 drop-shadow-xl rounded-lg border border-neutral-100/20`,
				className,
			)}
			{...props}
		>
			{children}
		</div>
	)
}
