import { classNames } from "@/src/lib/class-names"
import React, { forwardRef, ReactNode } from "react"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
	IconBefore?: React.ComponentType<{
		className?: string
		children?: ReactNode
	}>
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div>
				<input
					ref={ref}
					tabIndex={0}
					className={classNames(
						props.disabled && "pointer-events-none",
						"w-full px-3 py-2 text-space-50 rounded-lg bg-space-100 bg-opacity-10 placeholder-space-50/60 hover:bg-opacity-20" +
							" focus:bg-opacity-20" +
							" transition-colors text-sm",
						className,
					)}
					{...props}
				/>

				{children}
			</div>
		)
	},
)
