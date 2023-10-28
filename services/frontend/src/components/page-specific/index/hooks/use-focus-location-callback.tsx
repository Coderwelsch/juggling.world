import { AllPlayLocationsResponse } from "@/src/queries/all-play-locations"
import { AllPlayersResponse } from "@/src/queries/all-players"
import { OperationVariables, QueryResult } from "@apollo/client"
import mapboxgl from "mapbox-gl"
import * as React from "react"
import { useCallback } from "react"

export const useFocusLocationCallback = (
	mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
	selectedLocationId: string | null,
	allPlayLocations: QueryResult<AllPlayLocationsResponse, OperationVariables>,
	allPlayersData: QueryResult<AllPlayersResponse, OperationVariables>,
	sidebarRef: React.MutableRefObject<HTMLDivElement | null>,
) =>
	useCallback(() => {
		const map = mapRef.current

		if (!map) {
			return
		}

		if (!selectedLocationId) {
			return
		}

		const bounds = new mapboxgl.LngLatBounds()

		const playLocation = allPlayLocations.data?.locations.data.find(
			(l) => l.id === selectedLocationId,
		)

		if (!playLocation) {
			return
		}

		bounds.extend([
			playLocation.attributes.location.longitude,
			playLocation.attributes.location.latitude,
		])

		playLocation.attributes.users?.data.forEach((user) => {
			const player = allPlayersData.data?.players.data.find(
				(p) => p.id === user.id,
			)

			if (!player) {
				return
			}

			bounds.extend([
				player.attributes.location.longitude,
				player.attributes.location.latitude,
			])
		})

		map?.fitBounds(bounds, {
			duration: 3000,
			essential: true,
			padding: {
				top: 128,
				bottom: 86, // because of the marker label
				left: 64,
				right: sidebarRef.current?.clientWidth ?? 0,
			},
		})
	}, [
		allPlayLocations.data?.locations.data,
		allPlayersData.data?.players.data,
		mapRef,
		selectedLocationId,
		sidebarRef,
	])
