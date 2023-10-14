import { classNames } from "@/src/lib/class-names"
import * as React from "react"

interface MarkerLabelProps {
	label: string
	avatar?: string
	className?: string
}

export const MarkerLabel = ({ label, avatar, className }: MarkerLabelProps) => (
	<div
		className={classNames(
			"flex w-[calc(100%+1.7rem)] translate-x-[-0.65rem] gap-1 whitespace-nowrap rounded-full border-2 border-fuchsia-100 bg-fuchsia-950 p-1",
			"!font-sans",
			className,
		)}
		style={{
			font: "initial",
		}}
	>
		{avatar && (
			<img
				src={"http://cms.localhost" + avatar}
				className={"aspect-square w-5 rounded-full"}
				alt=""
			/>
		)}

		<p className={"mt-px text-xs text-white"}>{label}</p>
	</div>
)
