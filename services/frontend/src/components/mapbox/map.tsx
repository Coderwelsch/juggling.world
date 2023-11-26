import {
	NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
	NEXT_PUBLIC_MAPBOX_STYLE_URL,
} from "@/src/lib/constants"
import { Map as ReactMapGL, MapProps } from "react-map-gl"

import "mapbox-gl/dist/mapbox-gl.css"

export const Map = ({ accessToken, ...props }: MapProps) => {
	return (
		<ReactMapGL
			mapStyle={NEXT_PUBLIC_MAPBOX_STYLE_URL}
			mapboxAccessToken={NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
			projection={{
				name: "globe",
			}}
			{...props}
		/>
	)
}
