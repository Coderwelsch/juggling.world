import mapboxgl from "mapbox-gl"
import { useEffect } from "react"

export const useIsUserInteractingWithMap = ({
	map,
	onInteractionStart,
	onInteractionEnd,
}: {
	onInteractionStart: () => void
	onInteractionEnd: () => void
	map: mapboxgl.Map | undefined
}) => {
	useEffect(() => {
		if (!map) {
			return
		}

		const onMoveStart = () => {
			onInteractionStart()
		}

		const onMoveEnd = () => {
			onInteractionEnd()
		}

		map.on("mousedown", onMoveStart)
		map.on("mouseup", onMoveEnd)

		map.on("wheel", onMoveStart)
		map.on("zoomstart", onMoveStart)

		return () => {
			map.off("mousedown", onMoveStart)
			map.off("mouseup", onMoveEnd)

			map.off("zoomstart", onMoveStart)
		}
	}, [map, onInteractionEnd, onInteractionStart])
}
