import { Map } from "@/src/components/mapbox/map"
import { DotMarker } from "@/src/components/mapbox/marker/dot-marker"
import { MarkerLabel } from "@/src/components/mapbox/marker/marker-label"
import { classNames } from "@/src/lib/class-names"
import mapboxgl from "mapbox-gl"
import { createContext, ReactNode, useEffect, useRef, useState } from "react"

export interface SelectLocationInputProps {
	location?: {
		latitude: number
		longitude: number
	}
	onChange: (location: mapboxgl.LngLat) => void
	onMarkerClick?: (map: mapboxgl.Map | null) => void
	className?: string
	markerIntent?: Intent
	markerLabel?: string
	markerIcon?: ReactNode
	children?: ReactNode
}

export const SelectLocationFieldContext =
	createContext<SelectLocationInputProps | null>(null)

export const SelectLocationField = (props: SelectLocationInputProps) => {
	const {
		location,
		onChange,
		className,
		markerIcon,
		markerLabel,
		markerIntent,
		onMarkerClick,
		children,
	} = props

	const [isMapLoaded, setIsMapLoaded] = useState(false)
	const mapRef = useRef<mapboxgl.Map | null>(null)

	const latitude = location?.latitude ?? 12
	const longitude = location?.longitude ?? 52.5

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

		// make sure to have the marker in the viewport
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
				<SelectLocationFieldContext.Provider value={props}>
					{location && (
						<DotMarker
							location={[longitude, latitude]}
							onClick={() =>
								onMarkerClick && onMarkerClick(mapRef.current)
							}
							intent={markerIntent}
							active={true}
							focused={true}
							icon={markerIcon}
						>
							{markerLabel && (
								<MarkerLabel
									label={markerLabel}
									intent={"sun"}
								/>
							)}
						</DotMarker>
					)}

					{children}
				</SelectLocationFieldContext.Provider>
			</Map>
		</div>
	)
}
