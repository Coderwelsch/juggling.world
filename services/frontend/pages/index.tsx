import DIABOLO_STICKS from "@/src/assets/diabolo-sticks.svg"
import { Avatar } from "@/src/components/avatar/avatar"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { MapOverlay } from "@/src/components/map-overlay/map-overlay"
import { useAnimation } from "@/src/components/mapbox/hooks/use-animation"
import { useIsUserInteractingWithMap } from "@/src/components/mapbox/hooks/use-is-user-interacting-with-map"
import { ClusterMarker } from "@/src/components/mapbox/marker/cluster-marker"
import { DotMarker } from "@/src/components/mapbox/marker/dot-marker"
import { Line } from "@/src/components/mapbox/shapes/Line"
import { LandingPageNav } from "@/src/components/nav/landing-page-nav"
import { LocationContent } from "@/src/components/page-specific/index/sidebar-content/location-info"
import { PlayerContent } from "@/src/components/page-specific/index/sidebar-content/player-info"
import Sidebar from "@/src/components/sidebar/sidebar"
import { classNames } from "@/src/lib/class-names"
import { mapValueRange } from "@/src/lib/map-value-range"
import { allGroupsQuery, AllGroupsResponse } from "@/src/queries/all-groups"
import {
	allPlayLocationsQuery,
	AllPlayLocationsResponse,
} from "@/src/queries/all-play-locations"
import { allPlayersQuery, AllPlayersResponse } from "@/src/queries/all-players"
import { useQuery } from "@apollo/client"
import { BBox } from "geojson"
import mapboxgl, { LngLatLike } from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import * as React from "react"
import {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import Map, { ViewState, ViewStateChangeEvent } from "react-map-gl"
import { PointFeature } from "supercluster"
import useSupercluster from "use-supercluster"

interface CustomMarkerProperties {
	cluster?: boolean
	point_count?: number
	type?: "location" | "group" | "player"
	id?: string
	image?: string
}

const TEMPLATE_GEOJSON: PointFeature<CustomMarkerProperties> = {
	type: "Feature",
	properties: {
		cluster: false,
	},
	geometry: {
		type: "Point",
		coordinates: [0, 0],
	},
}

export const PlayersContext = createContext<
	AllPlayersResponse["players"]["data"]
>([])

export const MapContext = createContext<mapboxgl.Map | undefined>(undefined)

export default function App() {
	const [isMapReady, setIsMapReady] = useState(false)
	const mapRef = useRef<mapboxgl.Map | undefined>()
	const sidebarRef = useRef<HTMLDivElement | null>(null)
	const [isInterfaceShown, setIsInterfaceShown] = useState(false)
	const [isSpinAnimationInterrupted, setIsSpinAnimationInterrupted] =
		useState(false)

	const initialViewState: Partial<ViewState> = {
		longitude: 13.06965732917729,
		latitude: 52.38702480086221,
		zoom: 1,
	}

	const allGroups = useQuery<AllGroupsResponse>(allGroupsQuery)
	const allPlayersData = useQuery<AllPlayersResponse>(allPlayersQuery)
	const allPlayLocations = useQuery<AllPlayLocationsResponse>(
		allPlayLocationsQuery,
	)

	const [mapZoom, setMapZoom] = useState(1)

	const boundingBounds: BBox = mapRef.current
		? (mapRef.current.getBounds().toArray().flat() as BBox)
		: [0, 0, 0, 0, 0, 0]

	const superClusterPoints: PointFeature<CustomMarkerProperties>[] =
		useMemo(() => {
			if (
				!allGroups.data ||
				!allPlayersData.data ||
				!allPlayLocations.data
			) {
				return []
			}

			const geoJsonPoints: PointFeature<CustomMarkerProperties>[] = []

			allGroups.data.groups.data.forEach((group) => {
				geoJsonPoints.push({
					...TEMPLATE_GEOJSON,
					properties: {
						...TEMPLATE_GEOJSON.properties,
						type: "group",
						id: group.id,
						image: group.attributes.avatar.data.attributes.url,
					},
					geometry: {
						...TEMPLATE_GEOJSON.geometry,
						coordinates: [
							group.attributes.location.longitude,
							group.attributes.location.latitude,
						],
					},
				})
			})

			allPlayersData.data.players.data.forEach((player) => {
				geoJsonPoints.push({
					...TEMPLATE_GEOJSON,
					properties: {
						...TEMPLATE_GEOJSON.properties,
						type: "player",
						id: player.id,
						image: player.attributes.avatar?.data?.attributes.url,
					},
					geometry: {
						...TEMPLATE_GEOJSON.geometry,
						coordinates: [
							player.attributes.location.longitude,
							player.attributes.location.latitude,
						],
					},
				})
			})

			allPlayLocations.data.locations.data.forEach((location) => {
				geoJsonPoints.push({
					...TEMPLATE_GEOJSON,
					properties: {
						...TEMPLATE_GEOJSON.properties,
						type: "location",
						id: location.id,
						image: location.attributes.image?.data?.attributes.url,
					},
					geometry: {
						...TEMPLATE_GEOJSON.geometry,
						coordinates: [
							location.attributes.location.longitude,
							location.attributes.location.latitude,
						],
					},
				})
			})

			return geoJsonPoints
		}, [allGroups.data, allPlayersData.data, allPlayLocations.data])

	const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(
		null,
	)

	const { clusters, supercluster } = useSupercluster({
		points: superClusterPoints ? superClusterPoints : [],
		bounds: boundingBounds,
		zoom: mapZoom,
		options: { radius: 75, maxZoom: 20 },
	})

	const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
		null,
	)

	const [focusedLocations, setFocusedLocations] = useState<string[]>([])
	const [focusedPlayers, setFocusedPlayers] = useState<string[]>([])

	const [connectionLines, setConnectionLines] = useState<
		[[number, number], [number, number]][]
	>([])

	const onPlayerMarkerClick = useCallback(
		(id: string) => {
			if (selectedPlayerId === id) {
				return
			}

			const player = allPlayersData.data?.players.data.find(
				(p) => p.id === id,
			)

			if (!player) {
				return
			}

			setSelectedPlayerId(id)
			setSelectedLocationId(null)
			setIsInterfaceShown(true)
			setFocusedPlayers([id])
			setFocusedLocations(
				player?.attributes.userPlayLocations.data.map((l) => l.id) ||
					[],
			)
		},
		[allPlayersData.data?.players.data, selectedPlayerId],
	)

	useEffect(() => {
		const lines: [[number, number], [number, number]][] = []

		if (selectedPlayerId) {
			const player = allPlayersData.data?.players.data.find(
				(p) => p.id === selectedPlayerId,
			)

			if (!player) {
				return
			}

			// check if the player’s play locations are hidden in a cluster
			// to connect the lines to the cluster position
			const clustersCountainingLocations = clusters.filter((cluster) => {
				if (!cluster.id) {
					return false
				}

				const id = Number.parseInt(cluster.id.toString())
				const clusterChilds = supercluster?.getChildren(id)

				if (!clusterChilds) {
					return false
				}

				const hiddenLocation = clusterChilds
					.filter((c) => c.properties.type === "location")
					.find((child) => {
						return player.attributes.userPlayLocations.data.find(
							(l) => {
								if (l.id === child.properties.id) {
									return true
								}
							},
						)
					})

				console.log(
					"contains a connected user play location?",
					Boolean(hiddenLocation),
				)

				return Boolean(hiddenLocation)
			})

			console.log(
				"clustersCountainingLocations",
				clustersCountainingLocations,
			)

			clustersCountainingLocations.forEach((cluster) => {
				lines.push([
					[
						cluster.geometry.coordinates[0],
						cluster.geometry.coordinates[1],
					],
					[
						player.attributes.location.longitude,
						player.attributes.location.latitude,
					],
				])
			})
		} else if (selectedLocationId) {
			const location = allPlayLocations.data?.locations.data.find(
				(l) => l.id === selectedLocationId,
			)

			if (!location) {
				return
			}

			location.attributes.users?.data.forEach((l) => {
				const player = allPlayersData.data?.players.data.find(
					(pl) => pl.id === l.id,
				)

				if (!player) {
					return
				}

				lines.push([
					[
						player.attributes.location.longitude,
						player.attributes.location.latitude,
					],
					[
						location.attributes.location.longitude,
						location.attributes.location.latitude,
					],
				])
			})
		}

		setConnectionLines(lines)
	}, [
		selectedPlayerId,
		selectedLocationId,
		allPlayersData.data?.players.data,
		allPlayLocations.data?.locations.data,
		clusters.length,
		clusters,
		supercluster,
	])

	const onLocationMarkerClick = useCallback(
		(id: string) => {
			if (selectedLocationId === id) {
				return
			}

			const location = allPlayLocations.data?.locations.data.find(
				(l) => l.id === id,
			)

			if (!location) {
				return
			}

			setSelectedLocationId(id)
			setSelectedPlayerId(null)
			setIsInterfaceShown(true)
			setFocusedPlayers(
				location.attributes.users?.data.map((l) => l.id) || [],
			)
			setFocusedLocations([id])
		},
		[allPlayLocations.data?.locations.data, selectedLocationId],
	)

	const onMapClick = useCallback((e: mapboxgl.MapLayerMouseEvent) => {
		const elem = e.originalEvent.target as HTMLCanvasElement | null

		if (!elem?.classList.contains("mapboxgl-canvas")) {
			return
		}

		setSelectedPlayerId(null)
		setSelectedLocationId(null)

		setIsInterfaceShown(false)

		setFocusedLocations([])
		setFocusedPlayers([])
		setConnectionLines([])
	}, [])

	const onMapLoad = useCallback(({ target }: mapboxgl.MapboxEvent) => {
		mapRef.current = target
		setIsMapReady(true)
	}, [])

	useIsUserInteractingWithMap({
		map: mapRef.current,
		onInteractionStart: () => {
			setIsSpinAnimationInterrupted(true)
		},
		onInteractionEnd: () => {},
	})

	useAnimation({
		paused: isSpinAnimationInterrupted,
		onFrame: () => {
			if (!mapRef.current) {
				return
			}

			mapRef.current?.setCenter([
				mapRef.current.getCenter().lng + 0.01,
				mapRef.current.getCenter().lat,
			])
		},
	})

	const [openerOpacity, setOpenerOpacity] = useState(1)

	const focusSelectedLocation = useCallback(() => {
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
		selectedLocationId,
	])

	useEffect(() => {
		focusSelectedLocation()
	}, [
		selectedPlayerId,
		selectedLocationId,
		allPlayLocations.data,
		focusSelectedLocation,
	])

	const focusSelectedPlayer = useCallback(() => {
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
		selectedPlayerId,
		allPlayersData.data?.players.data,
		allPlayLocations.data?.locations.data,
	])

	useEffect(() => {
		focusSelectedPlayer()
	}, [
		selectedPlayerId,
		selectedLocationId,
		allPlayLocations.data,
		focusSelectedPlayer,
	])

	const handleZoom = useCallback(() => {
		const zoom = mapRef.current?.getZoom() ?? 1
		const opacity = mapValueRange(zoom, 1, 5, 1, 0)

		setOpenerOpacity(opacity > 1 ? 1 : opacity)
	}, [])

	useEffect(() => {
		if (!isMapReady) {
			return
		}

		mapRef.current?.on("zoom", handleZoom)

		return () => {
			mapRef.current?.off("zoom", handleZoom)
		}
	}, [handleZoom, isMapReady])

	const mapMarkers = useMemo(
		() =>
			clusters.map((cluster) => {
				if (cluster.properties.cluster) {
					return (
						<ClusterMarker
							key={cluster.id}
							location={cluster.geometry.coordinates}
							onClick={() => {
								if (
									!mapRef.current ||
									!supercluster ||
									!cluster.id
								) {
									return
								}

								const center: LngLatLike = [
									cluster.geometry.coordinates[0],
									cluster.geometry.coordinates[1],
								]

								const expansionZoom = Math.min(
									supercluster.getClusterExpansionZoom(
										Number.parseInt(cluster.id.toString()),
									),
									20,
								)

								mapRef.current.flyTo({
									center,
									zoom: expansionZoom,
								})
							}}
							count={cluster.properties.point_count || 0}
						/>
					)
				}

				if (cluster.properties.id === undefined) {
					return
				}

				const markerId: string = cluster.properties.id
				const image = cluster.properties.image
				const type = cluster.properties.type

				let isFocused = false
				let isActive = false
				let onClick = () => {}

				switch (type) {
					case "location":
						isFocused = focusedLocations.includes(markerId)
						isActive = selectedLocationId === markerId
						onClick = () => onLocationMarkerClick(markerId)
						break

					case "player":
						isFocused = focusedPlayers.includes(markerId)
						isActive = selectedPlayerId === markerId
						onClick = () => onPlayerMarkerClick(markerId)
				}

				return (
					<DotMarker
						key={`${type}-${markerId}`}
						location={cluster.geometry.coordinates}
						focused={isFocused}
						active={isActive}
						icon={image && <Avatar src={image} />}
						onClick={onClick}
					/>
				)
			}),
		[
			clusters,
			focusedLocations,
			focusedPlayers,
			onLocationMarkerClick,
			onPlayerMarkerClick,
			selectedLocationId,
			selectedPlayerId,
			supercluster,
		],
	)

	return (
		<>
			<LoaderOverlay
				shown={
					allPlayersData.loading ||
					allPlayLocations.loading ||
					allGroups.loading ||
					!isMapReady
				}
				fullPage={true}
			/>

			<LandingPageNav visible={!isInterfaceShown} />

			<section className={"h-screen w-full"}>
				<Map
					mapboxAccessToken={
						process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
					}
					projection={{
						name: "globe",
					}}
					initialViewState={initialViewState}
					mapStyle={process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL}
					onClick={onMapClick}
					onMove={(event: ViewStateChangeEvent) => {
						setMapZoom(event.viewState.zoom)
					}}
					onLoad={onMapLoad}
				>
					<MapContext.Provider value={mapRef.current}>
						{mapMarkers}

						{connectionLines.map((line, index) => (
							<Line
								key={index}
								coordinates={line}
								color={"rgb(16,185,129)"}
								width={4}
								outlineWidth={2}
							/>
						))}
					</MapContext.Provider>
				</Map>

				<div
					className={classNames(
						isInterfaceShown
							? "pointer-events-none"
							: "pointer-events-auto",
					)}
					style={{
						opacity: isInterfaceShown ? 0 : openerOpacity,
					}}
				>
					<MapOverlay>
						<MapOverlay.Headline>
							Let’s Connect!
						</MapOverlay.Headline>

						<img
							src={DIABOLO_STICKS.src}
							className={"relative z-0 mt-[-10%]"}
							alt={""}
						/>

						<MapOverlay.Description>
							Welcome to the all new space for us diabolo
							enthusiasts all over the world! Let’s connect, share
							and grow&nbsp;together!
						</MapOverlay.Description>

						<MapOverlay.ButtonGroup>
							<MapOverlay.SecondaryButton
								href={"/about"}
								className={
									openerOpacity < 0.5
										? "pointer-events-none"
										: ""
								}
							>
								about this project
							</MapOverlay.SecondaryButton>

							<MapOverlay.Button
								href={"/register"}
								className={
									openerOpacity < 0.5
										? "pointer-events-none"
										: ""
								}
							>
								create account
							</MapOverlay.Button>
						</MapOverlay.ButtonGroup>
					</MapOverlay>
				</div>

				<Sidebar
					ref={sidebarRef}
					isShown={isInterfaceShown}
					onClose={() => {}}
				>
					<PlayersContext.Provider
						value={allPlayersData?.data?.players.data || []}
					>
						{selectedPlayerId && (
							<PlayerContent
								id={selectedPlayerId}
								onLocationClick={onLocationMarkerClick}
							/>
						)}

						{selectedLocationId && (
							<LocationContent id={selectedLocationId} />
						)}
					</PlayersContext.Provider>
				</Sidebar>
			</section>
		</>
	)
}
