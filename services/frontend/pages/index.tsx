import DIABOLO_STICKS from "@/src/assets/diabolo-sticks.svg"
import { MapOverlay } from "@/src/components/map-overlay/map-overlay"
import { useAnimation } from "@/src/components/mapbox/hooks/use-animation"
import { useIsUserInteractingWithMap } from "@/src/components/mapbox/hooks/use-is-user-interacting-with-map"
import { DotMarker } from "@/src/components/mapbox/marker/dot-marker"
import { MarkerLabel } from "@/src/components/mapbox/marker/marker-label"
import { LandingPageNav } from "@/src/components/nav/landing-page-nav"
import { SidebarPlayerContent } from "@/src/components/page-specific/index/sidebar-content"
import Sidebar from "@/src/components/sidebar/sidebar"
import { mapValueRange } from "@/src/lib/map-value-range"
import {
	AllPlayersResponse,
	getAllPlayersQuery,
} from "@/src/queries/all-players"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import * as React from "react"
import { createContext, useCallback, useEffect, useRef, useState } from "react"
import Map, { ViewState } from "react-map-gl"

export const getServerSideProps = async () => {
	try {
		const allPlayers = await getAllPlayersQuery()

		return {
			props: {
				players: allPlayers.data.players.data,
			},
		}
	} catch (error) {
		console.log(error)

		return {
			props: {
				players: [],
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				error: error.message,
			},
		}
	}
}

interface AppProps {
	players: AllPlayersResponse["players"]["data"]
	error?: string
}

const PlayersContext = createContext<AllPlayersResponse["players"]["data"]>([])

export default function App({ players }: AppProps) {
	const [isMapReady, setIsMapReady] = useState(false)
	const mapRef = useRef<mapboxgl.Map | undefined>()
	const sidebarRef = useRef<HTMLDivElement | null>(null)
	const [isSidebarShown, setIsSidebarShown] = useState(false)
	const [isSpinAnimationInterrupted, setIsSpinAnimationInterrupted] =
		useState(false)

	const initialViewState: Partial<ViewState> = {
		longitude: 13.06965732917729,
		latitude: 52.38702480086221,
		zoom: 1,
	}

	const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([])

	const onMarkerClick = useCallback(
		(id: string) => {
			if (selectedPlayerIds.includes(id)) {
				return
			}

			setSelectedPlayerIds([...selectedPlayerIds, id])
			setIsSidebarShown(true)
		},
		[selectedPlayerIds, setSelectedPlayerIds],
	)

	const onMapClick = useCallback((e: mapboxgl.MapLayerMouseEvent) => {
		const elem = e.originalEvent.target as HTMLCanvasElement | null

		if (!elem?.classList.contains("mapboxgl-canvas")) {
			return
		}

		setSelectedPlayerIds([])
		setIsSidebarShown(false)
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

			mapRef.current.setBearing(mapRef.current.getBearing() + 0.02)
		},
	})

	const [openerOpacity, setOpenerOpacity] = useState(1)

	useEffect(() => {
		if (!mapRef.current) {
			return
		}

		const map = mapRef.current

		if (!selectedPlayerIds.length) {
			return
		}

		const firstPlayer = players.find((p) => p.id === selectedPlayerIds[0])

		if (!firstPlayer) {
			return
		}

		const playerLocation: mapboxgl.LngLatLike = [
			firstPlayer.attributes.location.longitude,
			firstPlayer.attributes.location.latitude,
		]

		map?.flyTo({
			center: playerLocation,
			duration: 3000,
			zoom: Math.max(map.getZoom(), 13),
		})

		// bounding box of selected players
		// const bounds = new mapboxgl.LngLatBounds()
		//
		// selectedPlayerIds.forEach((id) => {
		// 	const player = players.find((p) => p.id === id)
		//
		// 	if (!player) {
		// 		return
		// 	}
		//
		// 	bounds.extend([
		// 		player.attributes.location.longitude,
		// 		player.attributes.location.latitude,
		// 	])
		// })
		//
		// map.fitBounds(bounds, {
		// 	padding: {
		// 		top: 20,
		// 		bottom: 20,
		// 		left: 20,
		// 		right: 320,
		// 	},
		// 	maxZoom: 5,
		// 	screenSpeed: 0.7,
		// 	duration: 3000,
		// })
	}, [selectedPlayerIds])

	const handleZoom = useCallback(() => {
		const zoom = mapRef.current?.getZoom() ?? 1
		const opacity = mapValueRange(zoom, 1, 5, 1, 0)

		setOpenerOpacity(opacity > 1 ? 1 : opacity)
	}, [])

	useEffect(() => {
		if (!selectedPlayerIds.length) {
			return
		}
	}, [selectedPlayerIds])

	useEffect(() => {
		if (!isMapReady) {
			return
		}

		mapRef.current?.on("zoom", handleZoom)

		return () => {
			mapRef.current?.off("zoom", handleZoom)
		}
	}, [isMapReady])

	return (
		<>
			<LandingPageNav visible={!selectedPlayerIds.length} />

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
					onLoad={onMapLoad}
				>
					{players.map((player) => {
						const isSelected = selectedPlayerIds.includes(player.id)

						return (
							<DotMarker
								key={player.id}
								location={[
									player.attributes.location.longitude,
									player.attributes.location.latitude,
								]}
								selected={isSelected}
								onClick={() => onMarkerClick(player.id)}
							>
								{isSelected && (
									<MarkerLabel
										label={player.attributes.username}
										avatar={
											player.attributes.avatar?.data
												.attributes.url
										}
									></MarkerLabel>
								)}
							</DotMarker>
						)
					})}
				</Map>

				<div
					style={{
						opacity: isSidebarShown ? 0 : openerOpacity,
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
							<MapOverlay.SecondaryButton href={"/about"}>
								about this project
							</MapOverlay.SecondaryButton>

							<MapOverlay.Button href={"/register"}>
								create account
							</MapOverlay.Button>
						</MapOverlay.ButtonGroup>
					</MapOverlay>
				</div>

				<Sidebar
					ref={sidebarRef}
					isShown={isSidebarShown}
					onClose={() => {}}
				>
					<PlayersContext.Provider value={players}>
						<SidebarPlayerContent playerId={selectedPlayerIds[0]} />
					</PlayersContext.Provider>
				</Sidebar>
			</section>
		</>
	)
}
