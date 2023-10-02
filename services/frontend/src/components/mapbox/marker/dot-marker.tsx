import { classNames } from "@/src/lib/class-names"
import { ReactNode } from "react"
import * as React from "react"
import { Marker } from "react-map-gl"

interface DotMarkerProps {
	location: [number, number]
	selected?: boolean
	onClick: () => void
	icon?: ReactNode
	children?: ReactNode
}

export const DotMarker = ({
	children,
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
						"rounded-full border-2 overflow-hidden",
						selected
							? "h-6 w-6 border-fuchsia-50 bg-fuchsia-950"
							: "h-4 w-4 border-fuchsia-50 bg-fuchsia-400",
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
