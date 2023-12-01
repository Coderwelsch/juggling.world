import { classNames } from "@/src/lib/class-names"
import React, { forwardRef } from "react"

interface SearchFieldResultProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SearchFieldResult = forwardRef(
	(
		{ className, children, ...props }: SearchFieldResultProps,
		ref: React.ForwardedRef<HTMLButtonElement>,
	) => {
		return (
			<button
				type="button"
				ref={ref}
				tabIndex={0}
				className={classNames(
					`flex items-center cursor-pointer border-b border-space-50/20 px-4 py-3 text-space-50 transition hover:opacity-100/80 text-sm font-medium hover:bg-space-50/20`,

					className,
				)}
				{...props}
			>
				{children}
			</button>
		)
	},
)
