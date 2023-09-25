import { DotMarker } from "@/src/components/mapbox/marker/dot-marker"
import { MarkerLabel } from "@/src/components/mapbox/marker/marker-label"
import Sidebar from "@/src/components/sidebar/sidebar"
import { classNames } from "@/src/lib/class-names"
import { poppinsFont } from "@/src/lib/fonts"
import {
	AllDisciplinesResponse,
	getAllDisciplinesQuery,
} from "@/src/queries/all-disciplines"
import {
	AllPlayersResponse,
	getAllPlayersQuery,
} from "@/src/queries/all-players"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import Image from "next/image"
import * as React from "react"
import { createContext, useCallback, useEffect, useRef } from "react"
import Map, { ViewState } from "react-map-gl"

export const getServerSideProps = async () => {
	try {
		const allPlayers = await getAllPlayersQuery()

		const allDisciplines = await getAllDisciplinesQuery()

		return {
			props: {
				players: allPlayers.data.players.data,
				disciplines: allDisciplines.data.disciplines.data,
			},
		}
	} catch (error) {
		return {
			props: {
				players: [],
				disciplines: [],
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				error: error.message,
			},
		}
	}
}

interface AppProps {
	players: AllPlayersResponse["players"]["data"]
	disciplines: any[]
	error?: string
}

const PlayersContext = createContext<AllPlayersResponse["players"]["data"]>([])

const DisciplinesContext = createContext<
	AllDisciplinesResponse["disciplines"]["data"]
>([])

function SidebarPlayerContent({ playerId }: { playerId: string }) {
	const players = React.useContext(PlayersContext)
	const disciplines = React.useContext(DisciplinesContext)

	const player = players.find((p) => p.id === playerId)

	if (!player) {
		return <p>Player not found</p>
	}

	const playerDisciplines = disciplines.map((d) => {
		return disciplines.find((discipline) => discipline.id === d.id)
	})

	console.log(playerDisciplines)

	const avatarUrl = player.attributes.avatar?.data.attributes.url

	return (
		<div className={"flex w-full flex-col gap-4"}>
			<div className={"flex flex-row items-center gap-4"}>
				{avatarUrl && (
					<img
						src={`http://cms.localhost${avatarUrl}`}
						alt={""}
						className={"h-20 w-20 rounded-full"}
					/>
				)}

				<h2 className={"text-lg font-bold"}>
					{player.attributes.username}
				</h2>
			</div>

			<hr />

			<div className={"flex flex-col gap-6"}>
				<div className={"flex flex-col gap-2"}>
					<h3 className={"text-md font-bold"}>Plays:</h3>

					{disciplines.map((discipline) => {
						const icon =
							discipline.attributes.icon?.data.attributes.url

						return (
							<div
								key={discipline.id}
								className={classNames(
									"flex flex-row items-center gap-4",
								)}
							>
								{icon && (
									<Image
										className={classNames(
											"bg-fuchsia-400 rounded-full h-10 w-10 flex items-center justify-center",
										)}
										alt={""}
										width={32}
										height={32}
										src={`http://strapi${icon}`}
									/>
								)}

								<div>
									<h3 className={"text-sm font-bold"}>
										{discipline.attributes.name}
									</h3>
									<p className={"text-sm text-gray-500"}>
										{discipline.attributes.slug}
									</p>
								</div>
							</div>
						)
					})}
				</div>

				<div className={"flex flex-col gap-2"}>
					<h3 className={"text-md font-bold"}>Associated Groups:</h3>

					{disciplines.map((discipline) => {
						const icon =
							discipline.attributes.icon?.data.attributes.url

						return (
							<div
								key={discipline.id}
								className={classNames(
									"flex flex-row items-center gap-4",
								)}
							>
								{icon && (
									<Image
										className={classNames(
											"bg-fuchsia-400 rounded-full h-10 w-10 flex items-center justify-center",
										)}
										alt={""}
										width={32}
										height={32}
										src={`http://strapi${icon}`}
									/>
								)}

								<div>
									<h3 className={"text-sm font-bold"}>
										{discipline.attributes.name}
									</h3>
									<p className={"text-sm text-gray-500"}>
										{discipline.attributes.slug}
									</p>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default function App({ players, disciplines, error }: AppProps) {
	console.log(poppinsFont, "ghgghhg")

	const mapRef = useRef<mapboxgl.Map | undefined>()
	const sidebarRef = useRef<HTMLDivElement | null>(null)

	const initialViewState: Partial<ViewState> = {
		longitude: 13.06965732917729,
		latitude: 52.38702480086221,
		zoom: 1,
	}

	const [selectedPlayerIds, setSelectedPlayerIds] = React.useState<string[]>(
		[],
	)

	const onMarkerClick = useCallback(
		(id: string) => {
			if (selectedPlayerIds.includes(id)) {
				return
			}

			setSelectedPlayerIds([...selectedPlayerIds, id])
		},
		[selectedPlayerIds, setSelectedPlayerIds],
	)

	const onMapClick = useCallback((e: mapboxgl.MapLayerMouseEvent) => {
		const elem = e.originalEvent.target as HTMLCanvasElement | null

		if (!elem?.classList.contains("mapboxgl-canvas")) {
			return
		}

		setSelectedPlayerIds([])
	}, [])

	const onMapLoad = useCallback(({ target }: mapboxgl.MapboxEvent) => {
		mapRef.current = target
	}, [])

	useEffect(() => {
		if (!mapRef.current) {
			return
		}

		const map = mapRef.current

		const sideBarWidth = sidebarRef.current?.offsetWidth ?? 0

		if (!selectedPlayerIds.length) {
			return
		}

		const firstPlayer = players.find((p) => p.id === selectedPlayerIds[0])

		if (!firstPlayer) {
			return
		}

		map.flyTo({
			center: [
				firstPlayer.attributes.location.longitude,
				firstPlayer.attributes.location.latitude,
			],
			padding: {
				top: 20,
				bottom: 20,
				left: 20,
				right: sideBarWidth,
			},
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

	console.log("players", players)

	return (
		<div className={"h-screen w-full"}>
			<Map
				mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
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

			<Sidebar
				ref={sidebarRef}
				isShown={selectedPlayerIds.length > 0}
				onClose={() => {}}
			>
				<DisciplinesContext.Provider value={disciplines}>
					<PlayersContext.Provider value={players}>
						<SidebarPlayerContent playerId={selectedPlayerIds[0]} />
					</PlayersContext.Provider>
				</DisciplinesContext.Provider>
			</Sidebar>
		</div>
	)
}
