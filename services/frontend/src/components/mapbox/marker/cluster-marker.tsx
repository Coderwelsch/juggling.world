import { DotMarker } from "@/src/components/mapbox/marker/dot-marker"
import { Position } from "geojson"

interface ClusterMarkerProps {
	location: Position
	onClick: () => void
	count: number
}

export const ClusterMarker = ({
	location,
	onClick,
	count,
}: ClusterMarkerProps) => {
	return (
		<DotMarker
			location={location}
			onClick={onClick}
			icon={<span className="font-bold text-neutral-50">{count}</span>}
		/>
	)
}
