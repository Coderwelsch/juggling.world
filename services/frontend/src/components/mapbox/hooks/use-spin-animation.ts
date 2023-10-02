import mapboxgl from "mapbox-gl"
import { useCallback, useEffect, useRef } from "react"

export const useSpinAnimation = ({
	disabled,
	map,
}: {
	disabled: boolean
	map?: mapboxgl.Map
}) => {
	const isInterrupted = useRef(false)

	const handleMouseDown = useCallback(() => {
		isInterrupted.current = true
	}, [])

	const handleMouseUp = useCallback(() => {
		isInterrupted.current = false
		rotate()
	}, [])

	const rotate = useCallback(() => {
		console.log("interacting", isInterrupted.current)

		if (disabled || !map || isInterrupted.current) {
			return
		}

		const rotation = map.getBearing()
		map.rotateTo(rotation + 2)
		requestAnimationFrame(rotate)
	}, [disabled, map, isInterrupted])

	useEffect(() => {
		if (disabled || !map) {
			return
		}

		rotate()

		map.on("mousedown", handleMouseDown)
		map.on("mouseup", handleMouseUp)

		return () => {
			map.off("mousedown", handleMouseDown)
			map.off("mouseup", handleMouseUp)
		}
	}, [disabled, map])
}
