import { UseGetAllLocationsResponse } from "@/src/hooks/data/locations/use-get-all-locations"
import { UseGetAllPlayersResponse } from "@/src/hooks/data/player/use-get-all-players"
import { UseQueryResult } from "@tanstack/react-query"
import mapboxgl from "mapbox-gl"
import * as React from "react"
import { useCallback } from "react"

interface UseFocusLocationCallbackProps {
	mapRef: React.MutableRefObject<mapboxgl.Map | undefined>
	selectedLocationId: number | string | null
	playLocations: UseQueryResult<UseGetAllLocationsResponse>
	players: UseQueryResult<UseGetAllPlayersResponse>
	rightOffset?: number
}

export const useFocusLocationCallback = ({
	mapRef,
	selectedLocationId,
	playLocations,
	players,
	rightOffset = 0,
}: UseFocusLocationCallbackProps) =>
	useCallback(() => {
		const map = mapRef.current

		if (!map) {
			return
		}

		if (!selectedLocationId) {
			return
		}

		const bounds = new mapboxgl.LngLatBounds()

		const playLocation = playLocations.data?.find(
			(l) => l.id === selectedLocationId,
		)

		if (!playLocation) {
			return
		}

		bounds.extend([
			playLocation.location.longitude,
			playLocation.location.latitude,
		])

		playLocation.visitors?.forEach((id) => {
			const player = players.data?.find((p) => p.id === id)

			if (!player) {
				return
			}

			bounds.extend([player.location.longitude, player.location.latitude])
		})

		map?.fitBounds(bounds, {
			duration: 3000,
			essential: true,
			padding: {
				top: 128,
				bottom: 86, // because of the marker label
				left: 64,
				right: rightOffset + 64,
			},
		})
	}, [
		playLocations.data,
		players.data,
		mapRef,
		selectedLocationId,
		rightOffset,
	])
