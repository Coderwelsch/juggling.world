import { MapContext } from "@/pages"
import { ClusterMarker } from "@/src/components/mapbox/marker/cluster-marker"
import { DotMarker } from "@/src/components/mapbox/marker/dot-marker"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { PointFeature } from "supercluster"
import useSupercluster from "use-supercluster"

interface BasePoint<P> extends Record<string, unknown> {
	properties: P
	id: string
	type: string
	point_count?: number
	coordinates: [number, number]
}

interface ClusterProps<PointProperties> {
	points: BasePoint<PointProperties>[]
}

export const Cluster = <P extends { cluster: boolean }>({
	points,
}: ClusterProps<P>) => {
	const map = useContext(MapContext)

	const [zoom, setZoom] = useState(0)

	const handleZoom = useCallback(() => {
		if (!map) {
			return
		}

		const newZoom = map.getZoom()

		if (newZoom !== zoom) {
			setZoom(newZoom)
		}
	}, [map, zoom])

	useEffect(() => {
		if (!map) {
			return
		}

		map.on("zoom", handleZoom)

		return () => {
			map.off("zoom", handleZoom)
		}
	}, [handleZoom, map])

	const geoJsonPoints = useMemo<
		PointFeature<{ id: string; cluster?: boolean; point_count?: number }>[]
	>(() => {
		return points.map(({ id, type, coordinates, properties }) => {
			return {
				type: "Feature",
				properties: { cluster: false, id, type, properties },
				geometry: {
					type: "Point",
					coordinates,
				},
			}
		})
	}, [points])

	const { clusters, supercluster } = useSupercluster({
		points: geoJsonPoints,
		zoom,
	})

	return clusters.map((cluster) => {
		if (cluster.properties.cluster) {
			const count = cluster.properties.point_count || 0

			return (
				<ClusterMarker
					key={cluster.id}
					location={cluster.geometry.coordinates}
					count={count}
					onClick={() => {
						if (!supercluster) {
							return
						}

						const clusterId = Number.parseInt(
							(cluster.id || 0).toString(),
						)

						const expansionZoom = Math.min(
							supercluster.getClusterExpansionZoom(clusterId),
							20,
						)

						const center: [number, number] = [
							cluster.geometry.coordinates[0],
							cluster.geometry.coordinates[1],
						]

						map?.flyTo({
							center,
							zoom: expansionZoom,
						})
					}}
				/>
			)
		}

		return (
			<DotMarker
				key={cluster.properties.id}
				location={cluster.geometry.coordinates}
				onClick={() => {}}
			/>
		)
	})
}
