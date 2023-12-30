import { MapContext } from "@/src/components/mapbox/contexts/map-context"
import { ClusterMarker } from "@/src/components/mapbox/marker/cluster-marker"
import { BBox, Position } from "geojson"
import {
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import Supercluster, { AnyProps, PointFeature } from "supercluster"
import useSupercluster from "use-supercluster"

export interface ClusterBasePoint<P = Record<string, unknown>> {
	cluster?: boolean
	point_count?: number
	properties: P
	id: string | number
	coordinates: [number, number]
}

interface ClusterProps<PointProperties = Record<string, unknown>> {
	points: ClusterBasePoint<PointProperties>[]
	options?: Supercluster.Options<AnyProps, AnyProps>
	renderMarker: (props: {
		point: Position
		props: PointProperties
		id: string | number
	}) => ReactNode
	renderCluster?: (props: {
		point: Position
		count: number
		clusterId: number | string
		nextZoomLevel: number
		clusteredElems: PointProperties[]
	}) => ReactNode
	children?: (props: {
		clusters: (
			| Supercluster.PointFeature<ClusterBasePoint<PointProperties>>
			| Supercluster.PointFeature<
					Supercluster.ClusterProperties & Supercluster.AnyProps
			  >
		)[]
		supercluster: Supercluster<ClusterBasePoint<PointProperties>>
		pointLookupTable: Record<string, [number, number]>
	}) => React.ReactNode
}

export const Cluster = <P = Record<string, unknown>,>({
	points,
	options = {},
	children,
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
			points.map(({ id, coordinates, properties }) => {
				const point: PointFeature<ClusterBasePoint<P>> = {
					type: "Feature",
					properties: { id, properties, coordinates },
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

	// needed to prevent updates when the supercluster instance changes
	const superclusterRef = useRef<Supercluster<ClusterBasePoint<P>>>()

	useEffect(() => {
		superclusterRef.current = supercluster
	}, [supercluster])

	const [latestClusters, setLatestClusters] =
		useState<typeof clusters>(clusters)

	useEffect(() => {
		let shouldUpdate = false

		if (clusters.length !== latestClusters.length) {
			shouldUpdate = true
		} else {
			shouldUpdate = clusters.some(
				(cluster) =>
					!latestClusters.some(({ id }) => id === cluster.id),
			)
		}

		if (shouldUpdate) {
			setLatestClusters(clusters)
		}
	}, [clusters, latestClusters])

	const mappedClusters = useMemo(() => {
		return latestClusters.map((cluster) => {
			if (cluster.properties.cluster) {
				// TODO:
				const count = parseInt(
					cluster.properties.point_count?.toString() || "0",
				)

				// TODO:
				const clusterId = Number.parseInt((cluster.id || 0).toString())

				const children: P[] = superclusterRef
					.current!.getLeaves(clusterId, Infinity)
					.map((child) => child.properties.properties)

				if (!superclusterRef.current) {
					return null
				}

				const expansionZoom =
					superclusterRef.current.getClusterExpansionZoom(clusterId)

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
							if (!superclusterRef.current) {
								return
							}

							const expansionZoom = Math.min(
								superclusterRef.current.getClusterExpansionZoom(
									clusterId,
								),
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
	}, [latestClusters, map, renderCluster, renderMarker])

	const renderedChildren = useMemo(() => {
		if (!children) {
			return null
		}

		if (!superclusterRef.current) {
			return null
		}

		const pointLookupTable: Record<string, [number, number]> = {}

		latestClusters.forEach((point) => {
			if (!superclusterRef.current) {
				return
			}

			if (point.properties.cluster) {
				const elems = superclusterRef.current.getLeaves(
					Number(point.id),
					Infinity,
				)

				elems.forEach((elem) => {
					if (elem.properties.id in pointLookupTable) {
						return
					}

					pointLookupTable[elem.properties.id] = [
						point.geometry.coordinates[0],
						point.geometry.coordinates[1],
					]
				})
			} else {
				if (point.properties.id in pointLookupTable) {
					return
				}

				pointLookupTable[point.properties.id] = [
					point.geometry.coordinates[0],
					point.geometry.coordinates[1],
				]
			}
		})

		return children({
			clusters: latestClusters,
			supercluster: superclusterRef.current!,
			pointLookupTable,
		})
	}, [children, latestClusters, superclusterRef])

	return (
		<>
			{renderedChildren}
			{mappedClusters}
		</>
	)
}
