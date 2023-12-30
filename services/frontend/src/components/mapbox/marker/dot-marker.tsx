import { classNames } from "@/src/lib/class-names"
import { Position } from "geojson"
import * as React from "react"
import { ReactNode, useMemo } from "react"
import { Marker } from "react-map-gl"

export type Intent = "primary" | "secondary" | "green"

const dotMarkerStyles: Record<string, Record<Intent, string>> = {
	idle: {
		primary: "bg-primary-700 hover:border-2 hover:border-neutral-50",
		secondary: "bg-blue-400 hover:border-2 hover:border-neutral-50",
		green: "bg-emerald-600 hover:border-2 hover:border-neutral-50",
	},
	selected: {
		primary: "bg-primary-500 border-2 border-primary-500",
		secondary: "bg-blue-500 border-2 border-blue-500",
		green: "bg-emerald-600 border-2 border-emerald-600",
	},
	active: {
		primary: "bg-primary-500 border-2 border-neutral-50",
		secondary: "bg-blue-500 border-2 border-neutral-50",
		green: "bg-emerald-600 border-2 border-neutral-50",
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

const sonarStyles: Record<Intent, string> = {
	primary: "bg-primary-800",
	secondary: "bg-blue-600",
	green: "bg-emerald-600",
}

const SonarAnimation = ({ intent }: { intent: Intent }) => (
	<div
		className={classNames(
			"animate-sonar h-full w-full",
			sonarStyles[intent],
		)}
	/>
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
}: DotMarkerProps) => {
	const markerStyles = useMemo(() => {
		let styles = dotMarkerStyles.idle[intent]

		if (focused) {
			styles = dotMarkerStyles.selected[intent]
		}

		if (active) {
			styles = dotMarkerStyles.active[intent]
		}

		return styles
	}, [active, focused, intent])

	return (
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
					{active && <SonarAnimation intent={intent} />}

					<div
						className={classNames(
							"rounded-full overflow-hidden flex justify-center items-center",
							active ? "h-10 w-10" : "h-7 w-7",
							markerStyles,
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
							active && "translate-y-5",
						)}
					>
						{children}
					</div>
				)}
			</div>
		</Marker>
	)
}
