import { MapContext } from "@/pages"
import { ClusterMarker } from "@/src/components/mapbox/marker/cluster-marker"
import { BBox, Position } from "geojson"
import {
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react"
import Supercluster, { AnyProps, PointFeature } from "supercluster"
import useSupercluster from "use-supercluster"

export interface ClusterBasePoint<P> extends Record<string, unknown> {
	properties: P
	id: string
	coordinates: [number, number]
}

interface ClusterProps<PointProperties = AnyProps> {
	points: ClusterBasePoint<PointProperties>[]
	options?: Supercluster.Options<AnyProps, AnyProps>
	renderMarker: (props: {
		point: Position
		props: PointProperties
		id: string
	}) => ReactNode
	renderCluster?: (props: {
		point: Position
		count: number
		clusterId: number | string
		nextZoomLevel: number
		clusteredElems: PointProperties[]
	}) => ReactNode
}

export const Cluster = <P = Record<string, unknown>,>({
	points,
	options = {},
	renderMarker,
	renderCluster,
}: ClusterProps<P>) => {
	const map = useContext(MapContext)

	const [viewport, setViewport] = useState<{ bounds: BBox; zoom: number }>({
		zoom: 0,
		bounds: [0, 0, 0, 0],
	})

	const handleMove = useCallback(() => {
		if (!map) {
			return
		}

		const newViewport = { ...viewport }
		const bounds = map.getBounds().toArray()

		newViewport.bounds = [
			bounds[0][0],
			bounds[0][1],
			bounds[1][0],
			bounds[1][1],
		]

		newViewport.zoom = map.getZoom()

		setViewport(newViewport)
	}, [map, viewport])

	useEffect(() => {
		if (!map) {
			return
		}

		map.on("zoom", handleMove)
		map.on("move", handleMove)

		return () => {
			map.off("zoom", handleMove)
			map.off("move", handleMove)
		}
	}, [handleMove, map])

	const geoJsonPoints = useMemo<Array<PointFeature<ClusterBasePoint<P>>>>(
		() =>
			points.map(({ id, type, coordinates, properties }) => {
				const point: PointFeature<ClusterBasePoint<P>> = {
					type: "Feature",
					properties: { id, type, properties, coordinates },
					geometry: {
						type: "Point",
						coordinates,
					},
				}

				return point
			}),
		[points],
	)

	const { clusters, supercluster } = useSupercluster<ClusterBasePoint<P>>({
		points: geoJsonPoints,
		zoom: viewport.zoom,
		bounds: viewport.bounds,
		options: {
			radius: 75,
			maxZoom: 20,
			...options,
		},
	})

	return clusters.map((cluster) => {
		if (cluster.properties.cluster) {
			const count = parseInt(
				cluster.properties.point_count?.toString() || "2",
			)

			const clusterId = Number.parseInt((cluster.id || 0).toString())

			const children = supercluster!
				.getChildren(clusterId)
				.map((child) => child.properties.properties)

			const expansionZoom =
				supercluster!.getClusterExpansionZoom(clusterId)

			if (renderCluster) {
				return renderCluster({
					point: cluster.geometry.coordinates,
					count,
					clusterId,
					nextZoomLevel: expansionZoom,
					clusteredElems: children,
				})
			}

			return (
				<ClusterMarker
					key={cluster.id}
					location={cluster.geometry.coordinates}
					count={parseInt(count.toString(), 10)}
					onClick={() => {
						if (!supercluster) {
							return
						}

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

		return renderMarker({
			point: cluster.geometry.coordinates,
			props: cluster.properties.properties,
			id: cluster.properties.id,
		})
	})
}
