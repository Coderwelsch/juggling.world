import { NEXT_PUBLIC_CMS_API_URL } from "@/src/lib/constants"
import { useQuery } from "@tanstack/react-query"

const path = `${NEXT_PUBLIC_CMS_API_URL}/public/locations`

export type UseGetAllLocationsResponse = Array<{
	id: number
	name: string
	location: {
		latitude: number
		longitude: number
	}
	image?: {
		id: number
		url: string
	}
	visitors: Array<number>
}>

export const useGetAllLocations = () => {
	const fetchData = async (): Promise<UseGetAllLocationsResponse> => {
		const response = await fetch(path, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})

		return await response.json()
	}

	return useQuery({
		queryFn: async (context) => {
			return fetchData()
		},
		queryKey: [path],
	})
}
