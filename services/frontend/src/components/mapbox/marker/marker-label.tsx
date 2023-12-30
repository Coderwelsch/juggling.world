import { classNames } from "@/src/lib/class-names"
import * as React from "react"

type Intent = "primary" | "sun" | "mint" | "coral"

const markerLabelStyles: Record<Intent, string> = {
	primary: "bg-primary-600 text-primary-50",
	sun: "bg-sun-500 text-sun-900",
	mint: "bg-mint-600 text-mint-50",
	coral: "bg-coral-500 text-coral-50",
}

interface MarkerLabelProps {
	label: string
	className?: string
	intent?: Intent
}

export const MarkerLabel = ({
	label,
	className,
	intent = "primary",
}: MarkerLabelProps) => (
	<div
		className={classNames(
			"flex gap-1 whitespace-nowrap rounded-full p-1",
			"!font-sans",
			markerLabelStyles[intent],
			className,
		)}
		style={{
			font: "initial",
		}}
	>
		<p className={"px-1 text-xs"}>{label}</p>
	</div>
)
