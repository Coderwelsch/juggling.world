import { Inter } from "next/font/google"
import * as React from "react"
import Map from "react-map-gl"


const inter = Inter({ subsets: [ "latin" ] })

export default function App () {
	return (
		<Map
			mapboxAccessToken="<Mapbox access token>"
			initialViewState={ {
				longitude: -122.4,
				latitude: 37.8,
				zoom: 14,
			} }
			style={ { width: 600, height: 400 } }
			mapStyle="mapbox://styles/mapbox/streets-v9"
		/>
	)
}
