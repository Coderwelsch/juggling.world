import DIABOLO_STICKS from "@/src/assets/diabolo-sticks.svg"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { MapOverlay } from "@/src/components/map-overlay/map-overlay"
import { Cluster, ClusterBasePoint } from "@/src/components/mapbox/cluster"
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
import { getStrapiUrl } from "@/src/lib/get-strapi-url"
import { mapValueRange } from "@/src/lib/map-value-range"
import { allGroupsQuery, AllGroupsResponse } from "@/src/queries/all-groups"
import {
	allPlayLocationsQuery,
	AllPlayLocationsResponse,
} from "@/src/queries/all-play-locations"
import { allPlayersQuery, AllPlayersResponse } from "@/src/queries/all-players"
import { useQuery } from "@apollo/client"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import Image from "next/image"
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

interface CustomMarkerProperties {
	id: string
	type: "group" | "player" | "location"
	imageUrl?: string
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
	const [mapZoom, setMapZoom] = useState(0)
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

	const superClusterPoints: ClusterBasePoint<CustomMarkerProperties>[] =
		useMemo(() => {
			if (
				!allGroups.data ||
				!allPlayersData.data ||
				!allPlayLocations.data
			) {
				return []
			}

			const points: ClusterBasePoint<CustomMarkerProperties>[] = []

			allGroups.data.groups.data.forEach((group) => {
				points.push({
					id: `group-${group.id}`,
					coordinates: [
						group.attributes.location.longitude,
						group.attributes.location.latitude,
					],
					properties: {
						imageUrl: group.attributes.avatar.data.attributes.url,
						type: "group",
						id: group.id.toString(),
					},
				})
			})

			allPlayersData.data.players.data.forEach((player) => {
				points.push({
					id: `player-${player.id}`,
					coordinates: [
						player.attributes.location.longitude,
						player.attributes.location.latitude,
					],
					properties: {
						id: player.id.toString(),
						type: "player",
						imageUrl:
							player.attributes.avatar?.data?.attributes.url,
					},
				})
			})

			allPlayLocations.data.locations.data.forEach((location) => {
				points.push({
					id: `location-${location.id}`,
					coordinates: [
						location.attributes.location.longitude,
						location.attributes.location.latitude,
					],
					properties: {
						type: "location",
						imageUrl:
							location.attributes.image?.data?.attributes.url,
						id: location.id.toString(),
					},
				})
			})

			return points
		}, [allGroups.data, allPlayersData.data, allPlayLocations.data])

	const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(
		null,
	)

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
				console.error("player not found", id)
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

	// useEffect(() => {
	// 	const lines: [[number, number], [number, number]][] = []
	//
	// 	if (selectedPlayerId) {
	// 		const player = allPlayersData.data?.players.data.find(
	// 			(p) => p.id === selectedPlayerId,
	// 		)
	//
	// 		if (!player) {
	// 			return
	// 		}
	//
	// 		// check if the player’s play locations are hidden in a cluster
	// 		// to connect the lines to the cluster position
	// 		const clustersCountainingLocations = clusters.filter((cluster) => {
	// 			if (!cluster.id) {
	// 				return false
	// 			}
	//
	// 			const id = Number.parseInt(cluster.id.toString())
	// 			const clusterChilds = supercluster?.getChildren(id)
	//
	// 			if (!clusterChilds) {
	// 				return false
	// 			}
	//
	// 			const hiddenLocation = clusterChilds
	// 				.filter((c) => c.properties.type === "location")
	// 				.find((child) => {
	// 					return player.attributes.userPlayLocations.data.find(
	// 						(l) => {
	// 							if (l.id === child.properties.id) {
	// 								return true
	// 							}
	// 						},
	// 					)
	// 				})
	//
	// 			console.log(
	// 				"contains a connected user play location?",
	// 				Boolean(hiddenLocation),
	// 			)
	//
	// 			return Boolean(hiddenLocation)
	// 		})
	//
	// 		console.log(
	// 			"clustersCountainingLocations",
	// 			clustersCountainingLocations,
	// 		)
	//
	// 		clustersCountainingLocations.forEach((cluster) => {
	// 			lines.push([
	// 				[
	// 					cluster.geometry.coordinates[0],
	// 					cluster.geometry.coordinates[1],
	// 				],
	// 				[
	// 					player.attributes.location.longitude,
	// 					player.attributes.location.latitude,
	// 				],
	// 			])
	// 		})
	// 	} else if (selectedLocationId) {
	// 		const location = allPlayLocations.data?.locations.data.find(
	// 			(l) => l.id === selectedLocationId,
	// 		)
	//
	// 		if (!location) {
	// 			return
	// 		}
	//
	// 		location.attributes.users?.data.forEach((l) => {
	// 			const player = allPlayersData.data?.players.data.find(
	// 				(pl) => pl.id === l.id,
	// 			)
	//
	// 			if (!player) {
	// 				return
	// 			}
	//
	// 			lines.push([
	// 				[
	// 					player.attributes.location.longitude,
	// 					player.attributes.location.latitude,
	// 				],
	// 				[
	// 					location.attributes.location.longitude,
	// 					location.attributes.location.latitude,
	// 				],
	// 			])
	// 		})
	// 	}
	//
	// 	setConnectionLines(lines)
	// }, [
	// 	selectedPlayerId,
	// 	selectedLocationId,
	// 	allPlayersData.data?.players.data,
	// 	allPlayLocations.data?.locations.data,
	// 	clusters.length,
	// 	clusters,
	// 	supercluster,
	// ])

	const onLocationMarkerClick = useCallback(
		(id: string) => {
			if (selectedLocationId === id) {
				return
			}

			const location = allPlayLocations.data?.locations.data.find(
				(l) => l.id === id,
			)

			if (!location) {
				console.error("location not found")
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
						<Cluster<CustomMarkerProperties>
							points={superClusterPoints}
							renderMarker={({ point, props, id }) => {
								const type = props.type

								return (
									<DotMarker
										key={`${type}-${id}`}
										location={point}
										icon={
											props.imageUrl && (
												<Image
													src={getStrapiUrl(
														props.imageUrl,
													)}
													className={
														"h-full w-full overflow-hidden rounded-full"
													}
													alt={type}
													width={32}
													height={32}
												/>
											)
										}
										intent={
											type === "group"
												? "primary"
												: "active"
										}
										onClick={() => {
											switch (type) {
												case "location":
													onLocationMarkerClick(
														props.id,
													)
													break

												case "player":
													onPlayerMarkerClick(
														props.id,
													)
													break
											}
										}}
									/>
								)
							}}
							renderCluster={({
								point,
								count,
								clusterId,
								nextZoomLevel,
								clusteredElems,
							}) => {
								return (
									<ClusterMarker
										key={clusterId}
										location={point}
										onClick={() => {
											mapRef.current?.flyTo({
												center: [point[0], point[1]],
												zoom: nextZoomLevel,
											})
										}}
										count={count}
									/>
								)
							}}
						/>

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
