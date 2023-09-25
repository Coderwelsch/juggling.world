import { ReactNode } from "react"

interface FormProps {
	children: ReactNode
	onSubmit: () => void
}

export const Form = ({ children }: FormProps) => {
	return <form className={"flex flex-col gap-4"}>{children}</form>
}
