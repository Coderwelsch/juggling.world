import { classNames } from "@/src/lib/class-names"
import * as React from "react"

type Intent = "primary" | "secondary" | "green"

const markerLabelStyles: Record<Intent, string> = {
	primary: "bg-primary-700",
	secondary: "bg-blue-600",
	green: "bg-emerald-600",
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
			"flex gap-1 whitespace-nowrap rounded-full border-2 border-primary-100 bg-primary-950 p-1",
			"!font-sans",
			markerLabelStyles[intent],
			className,
		)}
		style={{
			font: "initial",
		}}
	>
		<p className={"px-1 text-xs text-white"}>{label}</p>
	</div>
)
