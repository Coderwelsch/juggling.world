import { classNames } from "@/src/lib/class-names"
import React from "react"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const InputField = ({ className, ...props }: InputFieldProps) => {
	return (
		<input
			className={classNames(
				className,
				"px-3 py-2 rounded-lg bg-neutral-100 bg-opacity-10 placeholder-space-50 hover:bg-opacity-20 focus:bg-opacity-20 transition-colors",
			)}
			{...props}
		/>
	)
}
