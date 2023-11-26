import { DialogBody } from "@/src/components/dialog/dialog-body"
import { DialogHeader } from "@/src/components/dialog/dialog-header"
import { classNames } from "@/src/lib/class-names"
import React, { useCallback } from "react"

type DialogProps = {
	children: React.ReactNode
	isVisible: boolean
	onClose: () => void
}

const Dialog = ({ children, isVisible, onClose }: DialogProps) => {
	const handleClose = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (event.target === event.currentTarget) {
				onClose()
			}
		},
		[onClose],
	)

	return (
		<div
			className={classNames(
				`fixed inset-0 z-50 bg-space-950/80 backdrop-blur-sm transition duration-500`,
				isVisible ? "opacity-100" : "pointer-events-none opacity-0",
			)}
		>
			<section
				onClick={handleClose}
				className={classNames(
					`absolute inset-0 flex flex-col items-center justify-center transition duration-500 transform gap-6 p-6`,
					isVisible
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-12",
				)}
			>
				{children}
			</section>
		</div>
	)
}

Dialog.Body = DialogBody
Dialog.Header = DialogHeader

export default Dialog
