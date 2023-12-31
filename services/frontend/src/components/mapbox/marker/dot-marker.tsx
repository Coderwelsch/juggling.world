import { classNames } from "@/src/lib/class-names"
import { Position } from "geojson"
import * as React from "react"
import { ReactNode } from "react"
import { Marker } from "react-map-gl"

export type Intent = "primary" | "secondary" | "active"

const dotMarkerStyles: {
	idle: Record<Intent, string>
	selected: Record<Intent, string>
} = {
	idle: {
		primary: "bg-primary-700 hover:border-2 hover:border-neutral-50",
		secondary: "bg-primary-400",
		active: "bg-emerald-400 hover:border-2 hover:border-neutral-50",
	},
	selected: {
		primary: "bg-primary-500 border-2 border-neutral-50",
		secondary: "bg-primary-600 border-2 border-neutral-50",
		active: "bg-emerald-500 border-2 border-neutral-50",
	},
}

export interface DotMarkerProps {
	location: Position
	focused?: boolean
	active?: boolean
	className?: string
	onClick: () => void
	intent?: Intent
	icon?: ReactNode
	children?: ReactNode
}

const SonarAnimation = () => (
	<div className="animate-sonar h-full w-full bg-primary-900" />
)

export const DotMarker = ({
	children,
	intent = "primary",
	className,
	location: [longitude, latitude],
	icon,
	onClick,
	focused,
	active,
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
				{active && <SonarAnimation />}

				<div
					className={classNames(
						"rounded-full overflow-hidden flex justify-center items-center",
						active ? "h-8 w-8" : "h-7 w-7",
						"hover:h-8 hover:w-8",
						dotMarkerStyles[focused ? "selected" : "idle"][intent],
						className,
					)}
				>
					{!icon && active && (
						<div
							className={classNames(
								"absolute h-2 w-2 top-1/2 left-1/2 rounded-full bg-slate-50 transform -translate-x-1/2 -translate-y-1/2",
							)}
						/>
					)}

					<div
						className={
							"flex h-full w-full items-center justify-center"
						}
					>
						{icon}
					</div>
				</div>
			</div>

			{children && (
				<div
					className={classNames(
						"absolute -translate-x-1/2 cursor-pointer translate-y-3.5",
						active && "translate-y-4",
					)}
				>
					{children}
				</div>
			)}
		</div>
	</Marker>
)
