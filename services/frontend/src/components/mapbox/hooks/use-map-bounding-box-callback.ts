import mapboxgl from "mapbox-gl"
import * as React from "react"
import { useCallback } from "react"

interface UseMapBoundingBox {
	mapRef: React.MutableRefObject<mapboxgl.Map | undefined>
	selectedIds: Array<string | number> | null
	entities: Array<
		unknown & {
			id: number | string
			location: {
				longitude: number
				latitude: number
			}
		}
	>
	rightOffset?: number
}

export const useMapBoundingBoxCallback = ({
	mapRef,
	selectedIds,
	entities,
	rightOffset = 0,
}: UseMapBoundingBox) =>
	useCallback(() => {
		const map = mapRef.current

		if (!map) {
			return
		}

		if (!selectedIds?.length) {
			return
		}

		const activeEntities = entities?.filter(
			(p) => selectedIds?.includes(p.id),
		)

		if (!activeEntities.length) {
			return
		}

		const bounds = new mapboxgl.LngLatBounds()

		activeEntities.forEach((entity) => {
			bounds.extend([entity.location.longitude, entity.location.latitude])
		})

		map?.fitBounds(bounds, {
			duration: 3000,
			essential: true,
			padding: {
				top: 128,
				bottom: 86,
				left: 64,
				right: rightOffset + 64,
			},
		})
	}, [mapRef, selectedIds, entities, rightOffset])
