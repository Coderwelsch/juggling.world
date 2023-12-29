import { UseGetAllLocationsResponse } from "@/src/hooks/data/locations/use-get-all-locations"
import { UseGetAllPlayersResponse } from "@/src/hooks/data/player/use-get-all-players"
import { UseQueryResult } from "@tanstack/react-query"
import mapboxgl from "mapbox-gl"
import * as React from "react"
import { useCallback } from "react"

export const useFocusSelectedPlayerCallback = (
	mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
	selectedPlayerId: string | number | null,
	players: UseQueryResult<UseGetAllPlayersResponse>,
	locations: UseQueryResult<UseGetAllLocationsResponse>,
	sidebarRef: React.MutableRefObject<HTMLDivElement | null>,
) =>
	useCallback(() => {
		const map = mapRef.current

		if (!map) {
			return
		}

		if (!selectedPlayerId) {
			return
		}

		const player = players.data?.find((p) => p.id === selectedPlayerId)

		if (!player) {
			return
		}

		const bounds = new mapboxgl.LngLatBounds()

		bounds.extend([player.location.longitude, player.location.latitude])

		player.playLocations.forEach((location) => {
			const playLocation = locations.data?.find((l) => l.id === location)

			if (!playLocation) {
				return
			}

			bounds.extend([
				playLocation.location.longitude,
				playLocation.location.latitude,
			])
		})

		map?.fitBounds(bounds, {
			duration: 3000,
			essential: true,
			padding: {
				top: 128,
				bottom: 86,
				left: 64,
				right: (sidebarRef.current?.clientWidth ?? 0) + 82,
			},
		})
	}, [mapRef, selectedPlayerId, players.data, sidebarRef, locations.data])
