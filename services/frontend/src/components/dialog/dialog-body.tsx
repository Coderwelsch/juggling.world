import { classNames } from "@/src/lib/class-names"
import React from "react"

interface DialogBodyProps {
	children: React.ReactNode
	className?: string
}

export const DialogBody = ({ children, className }: DialogBodyProps) => {
	return (
		<div
			className={classNames(
				"w-full max-w-2xl rounded-xl overflow-y-scroll border border-slate-50/20 bg-slate-800 px-5 py-4",
				className,
			)}
		>
			{children}
		</div>
	)
}
