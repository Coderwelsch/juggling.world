import { Map } from "@/src/components/mapbox/map"
import { DotMarker } from "@/src/components/mapbox/marker/dot-marker"
import { classNames } from "@/src/lib/class-names"
import mapboxgl from "mapbox-gl"
import { ReactNode, useEffect, useRef, useState } from "react"

export interface SelectLocationInputProps {
	location?: mapboxgl.LngLat
	onChange: (location: mapboxgl.LngLat) => void
	className?: string
	markerIcon?: ReactNode
}

export const SelectLocationField = ({
	location,
	onChange,
	className,
	markerIcon,
}: SelectLocationInputProps) => {
	const [isMapLoaded, setIsMapLoaded] = useState(false)
	const mapRef = useRef<mapboxgl.Map | null>(null)

	const latitude = location?.lat ?? 12
	const longitude = location?.lng ?? 52.5

	// fly to current location
	useEffect(() => {
		if (!isMapLoaded) {
			return
		}

		if (!mapRef.current) {
			return
		}

		if (!latitude || !longitude) {
			return
		}

		// make shure to have the marker in the viewport
		mapRef.current.flyTo({
			center: [longitude, latitude],
			zoom: Math.max(7, mapRef.current.getZoom()),
			essential: true,
			duration: 500,
		})
	}, [isMapLoaded, latitude, longitude])

	return (
		<div className={classNames("w-full h-full overflow-hidden", className)}>
			<Map
				onLoad={(map) => {
					mapRef.current = map.target
					setIsMapLoaded(true)
				}}
				initialViewState={{
					longitude,
					latitude,
					zoom: 1,
				}}
				onClick={(event) => {
					onChange(event.lngLat)
				}}
			>
				{location && (
					<DotMarker
						location={[longitude, latitude]}
						onClick={() => {}}
						active={true}
						focused={true}
						icon={markerIcon}
					/>
				)}
			</Map>
		</div>
	)
}
