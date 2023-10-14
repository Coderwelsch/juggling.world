import { MapContext } from "@/pages"
import * as crypto from "crypto"
import { GeoJSONSource } from "mapbox-gl"
import { useCallback, useContext, useEffect, useRef, useState } from "react"

export const Line = ({
	coordinates,
	color,
	width,
	outlineWidth,
}: {
	coordinates: [number, number][]
	color: string
	width: number
	outlineWidth?: number
}) => {
	const map = useContext(MapContext)
	const [id] = useState(crypto.randomBytes(16).toString("hex"))
	const lineAdded = useRef(false)

	const addLine = useCallback(() => {
		if (!map) {
			return
		}

		map.addSource(id, {
			type: "geojson",
			data: {
				type: "Feature",
				properties: {},
				geometry: {
					type: "LineString",
					coordinates: coordinates,
				},
			},
		})

		if (outlineWidth !== undefined) {
			map.addLayer({
				id: `${id}-outline`,
				type: "line",
				source: id,
				layout: {
					"line-join": "round",
					"line-cap": "round",
				},
				paint: {
					"line-color": "white",
					"line-width": outlineWidth * 2 + width,
				},
			})
		}

		map.addLayer({
			id: id,
			type: "line",
			source: id,
			layout: {
				"line-join": "round",
				"line-cap": "round",
			},
			paint: {
				"line-color": color,
				"line-width": width,
			},
		})

		lineAdded.current = true
	}, [color, coordinates, id, map, outlineWidth, width])

	useEffect(() => {
		// update layer style when color or coordinates changes
		if (!map) {
			return
		}

		if (!lineAdded.current) {
			return
		}

		map.setPaintProperty(id, "line-color", color)
		map.setPaintProperty(id, "line-width", width)

		if (outlineWidth !== undefined) {
			map.setPaintProperty(
				`${id}-outline`,
				"line-width",
				outlineWidth * 2 + width,
			)
		}

		const source = map.getSource(id) as GeoJSONSource

		if (!source) {
			return
		}

		source.setData({
			type: "Feature",
			properties: {},
			geometry: {
				type: "LineString",
				coordinates: coordinates,
			},
		})
	}, [coordinates, color, width, map, id, outlineWidth])

	useEffect(() => {
		if (!map) {
			return
		}

		addLine()

		return () => {
			lineAdded.current = false

			if (!map) {
				return
			}

			if (map.getLayer(id)) {
				map.removeLayer(id)
			}

			if (map.getLayer(`${id}-outline`)) {
				map.removeLayer(`${id}-outline`)
			}

			if (map.getSource(id)) {
				map.removeSource(id)
			}
		}
	}, [addLine, id, map])

	return null
}
