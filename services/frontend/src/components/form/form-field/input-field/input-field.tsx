import { classNames } from "@/src/lib/class-names"
import React, { ReactNode } from "react"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
	IconBefore?: React.ComponentType<{
		className?: string
		children?: ReactNode
	}>
}

export const InputField = ({
	className,
	children,
	...props
}: InputFieldProps) => {
	return (
		<div>
			<input
				tabIndex={0}
				className={classNames(
					props.disabled && "pointer-events-none",
					"px-3 py-2 rounded-lg bg-neutral-100 bg-opacity-10 placeholder-violet-100/50 hover:bg-opacity-20 focus:bg-opacity-20 transition-colors text-sm",
					className,
				)}
				{...props}
			/>

			{children}
		</div>
	)
}
