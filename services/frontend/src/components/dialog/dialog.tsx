import { classNames } from "@/src/lib/class-names"
import React, { useState, useEffect } from "react"

type DialogProps = {
	children: React.ReactNode
	isVisible: boolean
	onClose: () => void
}

const Dialog: React.FC<DialogProps> = ({ children, isVisible, onClose }) => {
	return (
		<div
			className={`fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm transition ${
				isVisible ? "opacity-100" : "pointer-events-none opacity-0"
			}`}
			onClick={onClose}
		>
			<div
				onClick={onClose}
				className={classNames(
					"absolute inset-0 flex flex-col items-center justify-center transition transform",
					isVisible
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-12",
				)}
			>
				{children}
			</div>
		</div>
	)
}

export default Dialog
