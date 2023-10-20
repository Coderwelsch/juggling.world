import { classNames } from "@/src/lib/class-names"
import * as React from "react"


interface MarkerLabelProps {
	label: string
	className?: string
}

export const MarkerLabel = ({ label, className }: MarkerLabelProps) => (
	<div
		className={ classNames(
			"flex gap-1 whitespace-nowrap rounded-full border-2 border-fuchsia-100 bg-fuchsia-950 p-1",
			"!font-sans",
			className,
		) }
		style={ {
			font: "initial",
		} }
	>
		<p className={ "px-1 text-xs text-white" }>{ label }</p>
	</div>
)
