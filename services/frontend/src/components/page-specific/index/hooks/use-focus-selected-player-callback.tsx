import { AllPlayLocationsResponse } from "@/src/queries/all-play-locations"
import { AllPlayersResponse } from "@/src/queries/all-players"
import { OperationVariables, QueryResult } from "@apollo/client"
import mapboxgl from "mapbox-gl"
import * as React from "react"
import { useCallback } from "react"

export const useFocusSelectedPlayerCallback = (
	mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
	selectedPlayerId: string | null,
	allPlayersData: QueryResult<AllPlayersResponse, OperationVariables>,
	allPlayLocations: QueryResult<AllPlayLocationsResponse, OperationVariables>,
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

		const player = allPlayersData.data?.players.data.find(
			(p) => p.id === selectedPlayerId,
		)

		if (!player) {
			return
		}

		const bounds = new mapboxgl.LngLatBounds()

		bounds.extend([
			player.attributes.location.longitude,
			player.attributes.location.latitude,
		])

		player.attributes.userPlayLocations.data.forEach((location) => {
			const playLocation = allPlayLocations.data?.locations.data.find(
				(l) => l.id === location.id,
			)

			if (!playLocation) {
				return
			}

			bounds.extend([
				playLocation.attributes.location.longitude,
				playLocation.attributes.location.latitude,
			])
		})

		map?.fitBounds(bounds, {
			duration: 3000,
			essential: true,
			padding: {
				top: 128,
				bottom: 86,
				left: 64,
				right: sidebarRef.current?.clientWidth ?? 0,
			},
		})
	}, [
		mapRef,
		selectedPlayerId,
		allPlayersData.data?.players.data,
		sidebarRef,
		allPlayLocations.data?.locations.data,
	])
