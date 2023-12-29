import mapboxgl from "mapbox-gl"
import { createContext } from "react"

export const MapContext = createContext<mapboxgl.Map | undefined>(undefined)

export const MapContextProvider = MapContext.Provider
