import React from "react"

interface DialogBodyProps {
	children: React.ReactNode
}

export const DialogBody = ({ children }: DialogBodyProps) => {
	return (
		<div
			className={
				"w-full max-w-2xl rounded-xl border border-space-50/20 bg-gray-800 px-5 py-4"
			}
		>
			{children}
		</div>
	)
}
