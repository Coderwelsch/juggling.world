import { classNames } from "@/src/lib/class-names"
import { ReactNode } from "react"
import * as React from "react"
import { Marker } from "react-map-gl"

type Intent = "primary" | "secondary" | "active"

const dotMarkerStyles: {
	idle: Record<Intent, string>
	selected: Record<Intent, string>
} = {
	idle: {
		primary: "bg-fuchsia-700 hover:border-2 hover:border-fuchsia-50",
		secondary: "bg-fuchsia-400",
		active: "bg-emerald-400 hover:border-2 hover:border-emerald-50",
	},
	selected: {
		primary: "bg-fuchsia-500 border-2 border-fuchsia-50",
		secondary: "bg-fuchsia-600 border-2 border-fuchsia-50",
		active: "bg-emerald-500 border-2 border-emerald-50",
	},
}

interface DotMarkerProps {
	location: [number, number]
	selected?: boolean
	className?: string
	onClick: () => void
	intent?: Intent
	icon?: ReactNode
	children?: ReactNode
}

export const DotMarker = ({
	children,
	intent = "primary",
	className,
	location: [longitude, latitude],
	icon,
	onClick,
	selected,
}: DotMarkerProps) => (
	<Marker
		longitude={longitude}
		latitude={latitude}
		anchor="bottom"
	>
		<div className={"relative"}>
			<div
				onClick={onClick}
				className={
					"absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
				}
			>
				<div
					className={classNames(
						"rounded-full overflow-hidden",
						selected ? "h-6 w-6" : "h-4 w-4",
						dotMarkerStyles[selected ? "selected" : "idle"][intent],
						className,
					)}
				>
					{icon}
				</div>
			</div>

			{children && (
				<div
					className={
						"absolute -translate-x-1/2 translate-y-3.5 cursor-pointer"
					}
				>
					{children}
				</div>
			)}
		</div>
	</Marker>
)
