import { Headline } from "@/src/components/headline/headline"
import { ReactNode } from "react"

interface DialogHeaderProps {
	title: string
	children?: ReactNode
}

export const DialogHeader = ({ title, children }: DialogHeaderProps) => {
	return (
		<div
			className={
				"flex flex-col items-center justify-between gap-3 text-slate-50"
			}
		>
			<Headline
				size={2}
				renderAs={"h2"}
			>
				{title}
			</Headline>

			{children}
		</div>
	)
}
