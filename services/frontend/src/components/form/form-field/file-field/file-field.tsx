import { classNames } from "@/src/lib/class-names"
import React, { forwardRef } from "react"

interface FileInputFieldProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

// eslint-disable-next-line react/display-name
export const FileField = forwardRef(
	(
		{ className, ...props }: FileInputFieldProps,
		ref: React.ForwardedRef<HTMLInputElement>,
	) => {
		return (
			<input
				ref={ref}
				type={"file"}
				className={classNames(
					className,
					"px-3 py-2 rounded-lg bg-neutral-100 bg-opacity-10 placeholder-space-100 hover:bg-opacity-20 focus:bg-opacity-20 transition-colors",
				)}
				{...props}
			/>
		)
	},
)
