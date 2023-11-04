import { PointFeature } from "supercluster"
import useSupercluster from "use-supercluster"

interface UseClusterProps<PointProperties extends { type: string }> {
	map: mapboxgl.Map | null
	points: PointProperties
}

interface UseClusterReturn<PointProperties extends { type: string }> {
	cluster: PointFeature<PointProperties>[]
}

export const useCluster = (props: UseClusterProps): UseClusterReturn => {
	return useSupercluster({})
}
