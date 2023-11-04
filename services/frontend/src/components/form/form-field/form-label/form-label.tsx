import { ReactNode } from "react"

interface LabelProps {
	children: ReactNode
}

export const FormLabel = ({ children }: LabelProps) => {
	return (
		<label className={"font-semibold text-neutral-200"}>{children}</label>
	)
}
