import { Line } from "@/src/components/mapbox/shapes/Line"
import * as React from "react"

export interface CustomMarkerProperties {
	id: string | number
	type: string
	name: string
	imageUrl?: string
	connectedIds?: Array<string | number>
}

export interface MarkerEntity {
	id: number | string
	type: "player" | "group" | "location"
	label: string
	originalId: number
	location: {
		longitude: number
		latitude: number
	}
	avatar?: {
		url: string
	}
	connectionIds?: Array<string | number>
}

export interface LinesProps {
	pointLookupTable: Record<string, [number, number]>
	selectedIds: Array<string | number> | null
	markerElements: MarkerEntity[]
}

export const Lines = ({
	pointLookupTable,
	selectedIds,
	markerElements,
}: LinesProps) => {
	const lines: [[number, number], [number, number]][] = []

	if (!markerElements?.length || !selectedIds?.length) {
		return null
	}

	const filteredMarkerElements = markerElements?.filter((m) =>
		selectedIds.includes(m.id),
	)

	filteredMarkerElements.forEach((marker) => {
		if (!marker) {
			return
		}

		const sourceId = marker.id
		let sourcePosition: [number, number] = [0, 0]

		// when id is not in lookup table it means that the marker is not visible
		// so we need to set the source position to the player position
		if (sourceId in pointLookupTable) {
			sourcePosition = pointLookupTable[sourceId]
		} else {
			sourcePosition = [
				marker.location.longitude,
				marker.location.latitude,
			]
		}

		marker.connectionIds?.forEach((targetId) => {
			const targetPosition = pointLookupTable[targetId]

			if (!targetPosition) {
				return
			}

			lines.push([sourcePosition, targetPosition])
		})
	})

	return lines.map((line, index) => (
		<Line
			key={index}
			coordinates={line}
			color={"rgb(16,185,129)"}
			width={4}
			outlineWidth={2}
		/>
	))
}
export const MemoizedLines = React.memo(Lines, (prevProps, nextProps) => {
	if (
		prevProps.markerElements !== nextProps.markerElements ||
		prevProps.selectedIds !== nextProps.selectedIds
	) {
		return false
	}

	for (const key in prevProps.pointLookupTable) {
		if (!(key in nextProps.pointLookupTable)) {
			return false
		}

		const prevPosition = prevProps.pointLookupTable[key]
		const nextPosition = nextProps.pointLookupTable[key]

		if (
			prevPosition[0] !== nextPosition[0] ||
			prevPosition[1] !== nextPosition[1]
		) {
			return false
		}
	}

	return true
})
