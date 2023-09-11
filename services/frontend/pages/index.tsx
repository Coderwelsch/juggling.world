import { classNames } from "@/lib/class-names"
import { getAllDisciplinesQuery } from "@/queries/all-disciplines"
import { getAllPlayersQuery } from "@/queries/all-players"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import * as React from "react"
import { useCallback } from "react"
import Map, { Marker, ViewState } from "react-map-gl"

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
	players: any[]
	disciplines: any[]
	error?: string
}

interface DotMarkerProps {
	location: [number, number]
	selected?: boolean
	onClick: () => void
}

const DotMarker = (props: DotMarkerProps) => (
	<Marker
		longitude={props.location[0]}
		latitude={props.location[1]}
		anchor="bottom"
		onClick={props.onClick}
	>
		<div
			className={classNames(
				"w-6 h-6 rounded-full border-2",
				props.selected
					? "bg-pink-400 border-white"
					: "bg-white border-pink-400",
			)}
		/>
	</Marker>
)

export default function App({ players, disciplines, error }: AppProps) {
	const firstPlayer = players.length > 0 ? players[0] : null

	const initialViewState: Partial<ViewState> = {
		longitude: firstPlayer
			? firstPlayer.attributes.location.longitude
			: -122.4,
		latitude: firstPlayer ? firstPlayer.attributes.location.latitude : 37.8,
		zoom: 14,
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

	console.log(selectedPlayerIds)

	const onMapClick = useCallback((e: mapboxgl.MapLayerMouseEvent) => {
		// only runs when nothing was clicked
		if (e.features?.length) {
			return
		}

		// setSelectedPlayerIds([])
	}, [])

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
			>
				{players.map((player) => (
					<DotMarker
						key={player.id}
						location={[
							player.attributes.location.longitude,
							player.attributes.location.latitude,
						]}
						selected={selectedPlayerIds.includes(player.id)}
						onClick={() => onMarkerClick(player.id)}
					/>
				))}
			</Map>
		</div>
	)
}
