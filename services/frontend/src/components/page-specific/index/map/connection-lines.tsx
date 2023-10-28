import { Line } from "@/src/components/mapbox/shapes/Line"
import { AllPlayLocationsResponse } from "@/src/queries/all-play-locations"
import { AllPlayersResponse } from "@/src/queries/all-players"
import * as React from "react"

export interface CustomMarkerProperties {
	id: string
	type: string
	name: string
	imageUrl?: string
}

export interface LinesProps {
	pointLookupTable: Record<string, [number, number]>
	selectedPlayerId: string | null
	selectedLocationId: string | null
	allPlayersData?: AllPlayersResponse
	allPlayLocations?: AllPlayLocationsResponse
}

export const Lines = ({
	pointLookupTable,
	selectedPlayerId,
	selectedLocationId,
	allPlayersData,
	allPlayLocations,
}: LinesProps) => {
	const lines: [[number, number], [number, number]][] = []

	if (selectedPlayerId) {
		const player = allPlayersData?.players.data.find(
			(p) => p.id === selectedPlayerId,
		)

		if (!player) {
			return
		}

		player.attributes.userPlayLocations.data.forEach((playLocation) => {
			const playerId = `player-${player.id}`
			const locationId = `location-${playLocation.id}`

			let sourcePosition: [number, number] | undefined
			let targetPosition: [number, number] | undefined

			// when id is not in lookup table it means that the marker is not visible
			// so we need to set the source position to the player position
			if (playerId in pointLookupTable) {
				sourcePosition = pointLookupTable[playerId]
			} else {
				sourcePosition = [
					player.attributes.location.longitude,
					player.attributes.location.latitude,
				]
			}

			if (locationId in pointLookupTable) {
				targetPosition = pointLookupTable[locationId]
			} else {
				const playLocationPosition =
					allPlayLocations?.locations.data.find(
						(l) => l.id === playLocation.id,
					)?.attributes.location

				if (!playLocationPosition) {
					return
				}

				targetPosition = [
					playLocationPosition.longitude,
					playLocationPosition.latitude,
				]
			}

			lines.push([sourcePosition, targetPosition])
		})
	} else if (selectedLocationId) {
		const location = allPlayLocations?.locations.data.find(
			(l) => l.id === selectedLocationId,
		)

		if (!location) {
			return
		}

		location.attributes.users?.data.forEach((user) => {
			const player = allPlayersData?.players.data.find(
				(p) => p.id === user.id,
			)

			if (!player) {
				return
			}

			const playerId = `player-${player.id}`
			const locationId = `location-${location.id}`

			let sourcePosition: [number, number] | undefined
			let targetPosition: [number, number] | undefined

			// when id is not in lookup table it means that the marker is not visible
			// so we need to set the source position to the player position
			if (playerId in pointLookupTable) {
				sourcePosition = pointLookupTable[playerId]
			} else {
				sourcePosition = [
					player.attributes.location.longitude,
					player.attributes.location.latitude,
				]
			}

			if (locationId in pointLookupTable) {
				targetPosition = pointLookupTable[locationId]
			} else {
				const playLocationPosition =
					allPlayLocations?.locations.data.find(
						(l) => l.id === location.id,
					)?.attributes.location

				if (!playLocationPosition) {
					return
				}

				targetPosition = [
					playLocationPosition.longitude,
					playLocationPosition.latitude,
				]
			}

			lines.push([sourcePosition, targetPosition])
		})
	}

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
		prevProps.selectedPlayerId !== nextProps.selectedPlayerId ||
		prevProps.selectedLocationId !== nextProps.selectedLocationId
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
