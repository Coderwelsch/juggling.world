import { classNames } from "@/src/lib/class-names"
import { DetailedHTMLProps, FormHTMLAttributes, ReactNode } from "react"

interface FormProps
	extends DetailedHTMLProps<
		FormHTMLAttributes<HTMLFormElement>,
		HTMLFormElement
	> {
	children: ReactNode
	onSubmit?: () => void
}

export const Form = ({ children, className, ...props }: FormProps) => {
	return (
		<form
			className={classNames("flex flex-col gap-4", className)}
			{...props}
		>
			{children}
		</form>
	)
}
