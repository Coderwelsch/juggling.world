import {
	DotMarker,
	DotMarkerProps,
} from "@/src/components/mapbox/marker/dot-marker"
import { Position } from "geojson"

interface ClusterMarkerProps extends DotMarkerProps {
	location: Position
	onClick: () => void
	count: number
}

export const ClusterMarker = ({
	location,
	onClick,
	count,
	...props
}: ClusterMarkerProps) => {
	return (
		<DotMarker
			location={location}
			onClick={onClick}
			icon={
				!props.active && (
					<span className="font-bold text-neutral-50">{count}</span>
				)
			}
			{...props}
		/>
	)
}
