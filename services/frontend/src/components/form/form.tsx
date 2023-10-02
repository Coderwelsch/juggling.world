import { classNames } from "@/src/lib/class-names"
import { ReactNode } from "react"

interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
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
