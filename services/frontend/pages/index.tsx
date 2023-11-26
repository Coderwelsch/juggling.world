import DIABOLO_STICKS from "@/src/assets/diabolo-sticks.svg"
import IconUserLarge from "@/src/components/icons/user-large"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { MapOverlay } from "@/src/components/map-overlay/map-overlay"
import { Cluster, ClusterBasePoint } from "@/src/components/mapbox/cluster"
import { useAnimation } from "@/src/components/mapbox/hooks/use-animation"
import { useIsUserInteractingWithMap } from "@/src/components/mapbox/hooks/use-is-user-interacting-with-map"
import { ClusterMarker } from "@/src/components/mapbox/marker/cluster-marker"
import { DotMarker, Intent } from "@/src/components/mapbox/marker/dot-marker"
import { MarkerLabel } from "@/src/components/mapbox/marker/marker-label"
import { LandingPageNav } from "@/src/components/nav/landing-page-nav"
import { useFocusLocationCallback } from "@/src/components/page-specific/index/hooks/use-focus-location-callback"
import { useFocusSelectedPlayerCallback } from "@/src/components/page-specific/index/hooks/use-focus-selected-player-callback"
import {
	CustomMarkerProperties,
	MemoizedLines,
} from "@/src/components/page-specific/index/map/connection-lines"
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
import { Position } from "geojson"
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
import { ViewState } from "react-map-gl"
import { Map } from "@/src/components/mapbox/map"

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
						name: group.attributes.name,
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
						name: player.attributes.username,
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
						id: location.id.toString(),
						type: "location",
						name: location.attributes.name,
						imageUrl:
							location.attributes.image?.data?.attributes.url,
					},
				})
			})

			return points
		}, [allGroups.data, allPlayersData.data, allPlayLocations.data])

	const [filterState, setFilterState] = useState<{
		type: "discipline" | null
		id: string | null
	}>({
		type: null,
		id: null,
	})

	const filteredSuperclusterPoints = useMemo(() => {
		if (!filterState.type || !filterState.id) {
			return superClusterPoints
		}

		return superClusterPoints.filter((point) => {
			const type = point.properties.type

			if (filterState.type === "discipline") {
				if (type === "player") {
					const player = allPlayersData.data?.players.data.find(
						(p) => p.id === point.properties.id,
					)

					if (!player) {
						return false
					}

					return player.attributes.disciplines.data.some(
						(d) => d.id === filterState.id,
					)
				}
			}

			return true
		})
	}, [
		allPlayersData.data?.players.data,
		filterState.id,
		filterState.type,
		superClusterPoints,
	])

	const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(
		null,
	)

	const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
		null,
	)

	const [focusedLocations, setFocusedLocations] = useState<string[]>([])
	const [focusedPlayers, setFocusedPlayers] = useState<string[]>([])

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

	const focusSelectedLocation = useFocusLocationCallback(
		mapRef,
		selectedLocationId,
		allPlayLocations,
		allPlayersData,
		sidebarRef,
	)

	useEffect(() => {
		focusSelectedLocation()
	}, [
		selectedPlayerId,
		selectedLocationId,
		allPlayLocations.data,
		focusSelectedLocation,
	])

	const focusSelectedPlayer = useFocusSelectedPlayerCallback(
		mapRef,
		selectedPlayerId,
		allPlayersData,
		allPlayLocations,
		sidebarRef,
	)

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

	const onRenderMarker = useCallback(
		({
			point,
			props: { id: propsId, imageUrl, name, type },
			id,
		}: {
			point: Position
			props: CustomMarkerProperties
			id: string
		}) => {
			let isActive = false
			let isFocused = false
			let intent: Intent = "primary"

			if (type === "player") {
				isActive = `${type}-${selectedPlayerId}` === id
				isFocused = focusedPlayers.includes(propsId)
				intent = "primary"
			} else if (type === "location") {
				isActive = `${type}-${selectedLocationId}` === id
				isFocused = focusedLocations.includes(propsId)
				intent = "secondary"
			} else if (type === "group") {
				intent = "active"
			}

			return (
				<DotMarker
					key={`${type}-${id}`}
					location={point}
					active={isActive}
					focused={isFocused}
					icon={
						imageUrl ? (
							<Image
								src={getStrapiUrl(imageUrl)}
								className={
									"h-full w-full overflow-hidden rounded-full"
								}
								alt={type}
								width={32}
								height={32}
							/>
						) : (
							<IconUserLarge
								className={"h-3.5 w-3.5 fill-neutral-50"}
							/>
						)
					}
					intent={intent}
					onClick={() => {
						switch (type) {
							case "location":
								onLocationMarkerClick(propsId)
								break

							case "player":
								onPlayerMarkerClick(propsId)
								break
						}
					}}
				>
					<MarkerLabel label={name} />
				</DotMarker>
			)
		},
		[
			focusedLocations,
			focusedPlayers,
			onLocationMarkerClick,
			onPlayerMarkerClick,
			selectedLocationId,
			selectedPlayerId,
		],
	)

	const renderCluster = ({
		point,
		count,
		clusterId,
		nextZoomLevel,
		clusteredElems,
	}: {
		point: Position
		count: number
		clusterId: string | number
		nextZoomLevel: number
		clusteredElems: CustomMarkerProperties[]
	}) => {
		const isActive = clusteredElems.some(
			({ id, type }: CustomMarkerProperties) => {
				if (type === "player") {
					return id === selectedPlayerId
				} else if (type === "location") {
					return id === selectedLocationId
				}

				return false
			},
		)

		return (
			<ClusterMarker
				key={clusterId}
				active={isActive}
				focused={isActive}
				location={point}
				onClick={() => {
					mapRef.current?.flyTo({
						center: [point[0], point[1]],
						zoom: nextZoomLevel,
						duration: 500,
					})
				}}
				count={count}
			/>
		)
	}

	return (
		<>
			<LoaderOverlay
				shown={
					allPlayersData.loading ||
					allPlayLocations.loading ||
					allGroups.loading ||
					!isMapReady
				}
				fullPage
			/>

			<LandingPageNav visible={!isInterfaceShown} />

			<section className={"h-screen w-full"}>
				<Map
					projection={{
						name: "globe",
					}}
					initialViewState={initialViewState}
					onClick={onMapClick}
					onLoad={onMapLoad}
				>
					<MapContext.Provider value={mapRef.current}>
						<Cluster<CustomMarkerProperties>
							points={filteredSuperclusterPoints}
							options={{
								maxZoom: 20,
							}}
							renderMarker={onRenderMarker}
							renderCluster={renderCluster}
						>
							{({ pointLookupTable }) => (
								<MemoizedLines
									selectedLocationId={selectedLocationId}
									allPlayLocations={allPlayLocations.data}
									allPlayersData={allPlayersData.data}
									selectedPlayerId={selectedPlayerId}
									pointLookupTable={pointLookupTable}
								/>
							)}
						</Cluster>
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
							Welcome to the all new space for us juggling
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
								onDisciplineClick={(id) => {
									setFilterState({
										type: "discipline",
										id,
									})
								}}
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
