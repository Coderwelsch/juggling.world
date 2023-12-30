import { classNames } from "@/src/lib/class-names"
import { ReactNode } from "react"

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
	children: ReactNode
}

export const FormLabel = ({ children, className, ...props }: LabelProps) => {
	return (
		<label
			className={classNames("font-semibold text-neutral-50", className)}
			{...props}
		>
			{children}
		</label>
	)
}
