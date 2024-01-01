import DIABOLO_STICKS from "@/src/assets/diabolo-sticks.svg"
import IconPark from "@/src/components/icons/tree"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { MapOverlay } from "@/src/components/map-overlay/map-overlay"
import { Cluster, ClusterBasePoint } from "@/src/components/mapbox/cluster"
import { MapContextProvider } from "@/src/components/mapbox/contexts/map-context"
import { useAnimation } from "@/src/components/mapbox/hooks/use-animation"
import { useIsUserInteractingWithMap } from "@/src/components/mapbox/hooks/use-is-user-interacting-with-map"
import { LegendOverlay } from "@/src/components/mapbox/legend-overlay"
import { Map } from "@/src/components/mapbox/map"
import { ClusterMarker } from "@/src/components/mapbox/marker/cluster-marker"
import { DotMarker } from "@/src/components/mapbox/marker/dot-marker"
import { MarkerLabel } from "@/src/components/mapbox/marker/marker-label"
import { LandingPageNav } from "@/src/components/nav/landing-page-nav"
import { useMapBoundingBoxCallback } from "@/src/components/mapbox/hooks/use-map-bounding-box-callback"
import {
	CustomMarkerProperties,
	MarkerEntity,
	MemoizedLines,
} from "@/src/components/mapbox/connection-lines"
import { LocationContent } from "@/src/components/page-specific/index/sidebar-content/location-info"
import { PlayerContent } from "@/src/components/page-specific/index/sidebar-content/player-info"
import Sidebar, { Body } from "@/src/components/sidebar/sidebar"
import { useGetAllGroups } from "@/src/hooks/data/groups/use-get-all-groups"
import { useGetAllLocations } from "@/src/hooks/data/locations/use-get-all-locations"
import {
	useGetAllPlayers,
	UseGetAllPlayersResponse,
} from "@/src/hooks/data/player/use-get-all-players"
import { useBrowserSize } from "@/src/hooks/use-browser-size"
import { classNames } from "@/src/lib/class-names"
import { getStrapiUrl } from "@/src/lib/get-strapi-url"
import { mapValueRange } from "@/src/lib/map-value-range"
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

export const PlayersContext = createContext<UseGetAllPlayersResponse>([])

export default function App() {
	const [isMapReady, setIsMapReady] = useState(false)
	const mapRef = useRef<mapboxgl.Map | undefined>()
	const sidebarRef = useRef<HTMLDivElement | null>(null)
	const [isMapOverlayEnabled, setIsMapOverlayEnabled] = useState(true)
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const [isSpinAnimationInterrupted, setIsSpinAnimationInterrupted] =
		useState(false)

	const initialViewState: Partial<ViewState> = {
		longitude: 13.06965732917729,
		latitude: 52.38702480086221,
		zoom: 1,
	}

	const allPlayers = useGetAllPlayers()
	const allGroups = useGetAllGroups()
	const allPlayLocations = useGetAllLocations()

	const markerElements = useMemo(() => {
		const entities: Array<MarkerEntity> = []

		// element ids are prefixed with their type
		if (allGroups.data) {
			entities.push(
				...allGroups.data.map((g) => ({
					id: `group-${g.id}`,
					originalId: g.id,
					type: "group" as const,
					label: g.name,
					icon: g.avatar?.url,
					location: g.location,
					lineColor: "#FAEB00",
					connectionIds: [...g.members.map((id) => `player-${id}`)],
				})),
			)
		}

		if (allPlayers.data) {
			entities.push(
				...allPlayers.data.map((p) => ({
					id: `player-${p.id}`,
					originalId: p.id,
					type: "player" as const,
					label: p.username,
					icon: p.avatar?.url,
					location: p.location,
					lineColor: "#F53D07",
					connectionIds: [
						...p.groups.map((id) => `group-${id}`),
						...p.visitedLocations.map((id) => `location-${id}`),
					],
				})),
			)
		}

		if (allPlayLocations.data) {
			entities.push(
				...allPlayLocations.data.map((l) => ({
					id: `location-${l.id}`,
					originalId: l.id,
					type: "location" as const,
					label: l.name,
					icon: IconPark,
					location: l.location,
					lineColor: "#00C288",
					connectionIds: [...l.visitors.map((id) => `player-${id}`)],
				})),
			)
		}

		return entities
	}, [allGroups.data, allPlayLocations.data, allPlayers.data])

	const superClusterPoints: ClusterBasePoint<CustomMarkerProperties>[] =
		useMemo(() => {
			if (!markerElements.length) {
				return []
			}

			const points: ClusterBasePoint<CustomMarkerProperties>[] = []

			markerElements.forEach((marker) => {
				points.push({
					id: marker.id,
					coordinates: [
						marker.location.longitude,
						marker.location.latitude,
					],
					properties: {
						icon: marker.icon,
						type: marker.type,
						name: marker.label,
						id: marker.id,
						connectedIds: marker.connectionIds,
					},
				})
			})

			return points
		}, [markerElements])

	const [filterState, setFilterState] = useState<{
		type: "discipline" | null
		id: number | null
	}>({
		type: null,
		id: null,
	})

	const [selectedIds, setSelectedIds] = useState<Array<string | number>>([])
	const [highlightedIds, setHighlightedIds] = useState<
		Array<string | number>
	>([])

	const filteredSuperclusterPoints = useMemo(() => {
		if (!filterState.type || !filterState.id) {
			return superClusterPoints
		}

		return superClusterPoints.filter((point) => {
			const type = point.properties.type

			if (filterState.type === "discipline") {
				if (type === "player") {
					const player = allPlayers.data?.find(
						(p) => p.id === point.properties.id,
					)

					if (!player) {
						return false
					}

					return player.disciplines.some((d) => d === filterState.id)
				}
			}

			return true
		})
	}, [allPlayers.data, filterState.id, filterState.type, superClusterPoints])

	const onMarkerClick = useCallback(
		(id: string | number) => {
			const connectedMarkerIds: Array<string | number> = []
			const marker = markerElements.find((m) => m.id === id)

			switch (marker?.type) {
				case "player": {
					const player = allPlayers.data?.find(
						(p) => p.id === marker.originalId,
					)

					if (!player) {
						return
					}

					connectedMarkerIds.push(`player-${player.id}`)

					player.visitedLocations.forEach((locationId) => {
						connectedMarkerIds.push(`location-${locationId}`)
					})

					player.groups.forEach((groupId) => {
						connectedMarkerIds.push(`group-${groupId}`)
					})

					break
				}

				case "group": {
					const group = allGroups.data?.find(
						(g) => g.id === marker.originalId,
					)

					if (!group) {
						return
					}

					group.members.forEach((playerId) => {
						connectedMarkerIds.push(`player-${playerId}`)
					})

					break
				}

				case "location": {
					const location = allPlayLocations.data?.find(
						(l) => l.id === marker.originalId,
					)

					if (!location) {
						return
					}

					location.visitors.forEach((id) => {
						connectedMarkerIds.push(`player-${id}`)
					})

					break
				}
			}

			setHighlightedIds(connectedMarkerIds)
			setSelectedIds([id])
			setIsSidebarOpen(true)
			setIsMapOverlayEnabled(false)
		},
		[
			allGroups.data,
			allPlayLocations.data,
			allPlayers.data,
			markerElements,
		],
	)

	const onMapClick = useCallback((e: mapboxgl.MapLayerMouseEvent) => {
		const elem = e.originalEvent.target as HTMLCanvasElement | null

		if (!elem?.classList.contains("mapboxgl-canvas")) {
			return
		}

		setIsSidebarOpen(false)
		setIsMapOverlayEnabled(true)

		setSelectedIds([])
		setHighlightedIds([])
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

	const selectedBoundingBoxIds = useMemo(() => {
		return [
			...selectedIds,
			...highlightedIds.filter((id) => !selectedIds.includes(id)),
		]
	}, [highlightedIds, selectedIds])

	const browserSize = useBrowserSize()

	const paddingOptions = useMemo(() => {
		return {
			top: 64,
			bottom: browserSize.width > 768 ? 64 : browserSize.height * 0.3,
			left: 64,
			right:
				browserSize.width > 768
					? (sidebarRef?.current?.offsetWidth ?? 0) + 64
					: 64,
		}
	}, [browserSize.height, browserSize.width])

	const boundingBoxCallback = useMapBoundingBoxCallback({
		mapRef,
		selectedIds: selectedBoundingBoxIds,
		entities: markerElements,
		paddingOptions: paddingOptions,
	})

	useEffect(() => {
		boundingBoxCallback()
	}, [selectedIds, allPlayLocations.data, boundingBoxCallback])

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
			props: { id: propsId, icon: Icon, name, type },
			id,
		}: {
			point: Position
			props: CustomMarkerProperties
			id: string | number
		}) => {
			const isActive = selectedIds.includes(propsId)
			const isFocused = highlightedIds.includes(propsId)
			let intent: Intent = "primary"

			if (type === "player") {
				intent = "coral"
			} else if (type === "location") {
				intent = "mint"
			} else if (type === "group") {
				intent = "sun"
			}

			return (
				<DotMarker
					key={`${type}-${id}`}
					location={point}
					active={isActive}
					focused={isFocused}
					icon={
						Icon && typeof Icon !== "string" ? (
							<Icon
								className={
									"h-[70%] w-[70%] overflow-hidden rounded-full fill-neutral-50"
								}
							/>
						) : (
							<Image
								src={getStrapiUrl(Icon || "")}
								className={
									"h-full w-full overflow-hidden rounded-full"
								}
								alt={type}
								width={32}
								height={32}
							/>
						)
					}
					intent={intent}
					onClick={() => {
						onMarkerClick(propsId)
					}}
				>
					<MarkerLabel
						label={name}
						intent={intent}
					/>
				</DotMarker>
			)
		},
		[highlightedIds, onMarkerClick, selectedIds],
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
			({ id }: CustomMarkerProperties) => {
				return selectedIds.includes(id)
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

	const selectedEntities = useMemo(() => {
		return markerElements.filter((marker) => {
			return selectedIds.includes(marker.id)
		})
	}, [markerElements, selectedIds])

	const isLoaderShown = useMemo(() => {
		return (
			allPlayers.isLoading ||
			allPlayLocations.isLoading ||
			allGroups.isLoading ||
			!isMapReady
		)
	}, [
		allGroups.isLoading,
		allPlayLocations.isLoading,
		allPlayers.isLoading,
		isMapReady,
	])

	return (
		<>
			<LoaderOverlay
				shown={isLoaderShown}
				fullPage
			/>

			<LandingPageNav visible={!isSidebarOpen} />

			<section className={"h-[100dvh] w-full"}>
				<Map
					projection={{
						name: "globe",
					}}
					initialViewState={initialViewState}
					onClick={onMapClick}
					onLoad={onMapLoad}
				>
					<MapContextProvider value={mapRef.current}>
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
									selectedIds={selectedIds}
									markerElements={markerElements}
									pointLookupTable={pointLookupTable}
								/>
							)}
						</Cluster>
					</MapContextProvider>
				</Map>

				<LegendOverlay
					className={classNames("pointer-events-none")}
					style={{
						opacity: isSidebarOpen
							? 0
							: isMapOverlayEnabled
							? openerOpacity < 0.3
								? 1 - openerOpacity
								: 0
							: 1 - openerOpacity,
						transition: isMapOverlayEnabled
							? "opacity 250ms ease-in-out"
							: undefined,
					}}
				>
					<LegendOverlay.Item intent={"coral"}>
						Users
					</LegendOverlay.Item>

					<LegendOverlay.Item intent={"sun"}>
						Groups
					</LegendOverlay.Item>

					<LegendOverlay.Item intent={"mint"}>
						Locations
					</LegendOverlay.Item>
				</LegendOverlay>

				<div
					className={classNames(
						!isMapOverlayEnabled
							? "pointer-events-none"
							: "pointer-events-auto",
					)}
					style={{
						opacity: isMapOverlayEnabled ? openerOpacity : 0,
						transition: !isMapOverlayEnabled
							? "opacity 250ms ease-in-out"
							: undefined,
					}}
				>
					<MapOverlay>
						<MapOverlay.Headline>
							Let’s Connect!
						</MapOverlay.Headline>

						<Image
							src={DIABOLO_STICKS.src}
							className={"relative z-0 mt-[-10%]"}
							alt={""}
							width={512}
							height={256}
						/>

						<MapOverlay.Description
							className={"mb-3 text-primary-100"}
						>
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
					isShown={isSidebarOpen}
					onClose={() => setIsSidebarOpen(false)}
				>
					<PlayersContext.Provider value={allPlayers?.data || []}>
						{selectedEntities.length ? (
							<>
								{selectedEntities[0].type === "player" && (
									<PlayerContent
										id={selectedEntities[0].originalId}
										onDisciplineClick={(id) => {
											setFilterState({
												type: "discipline",
												id,
											})
										}}
										onLocationClick={onMarkerClick}
									/>
								)}

								{selectedEntities[0].type === "group" && (
									<Body className="p-0">
										<p>Group</p>
									</Body>
								)}

								{selectedEntities[0].type === "location" && (
									<LocationContent
										id={selectedEntities[0].originalId}
									/>
								)}
							</>
						) : null}
					</PlayersContext.Provider>
				</Sidebar>
			</section>
		</>
	)
}
