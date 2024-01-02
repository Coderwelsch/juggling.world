import { NEXT_PUBLIC_CMS_API_URL } from "@/src/lib/constants"
import { LocationType } from "@/src/types/cms/api"
import { useQuery } from "@tanstack/react-query"

const getPath = (locationId: number) =>
	`${NEXT_PUBLIC_CMS_API_URL}/public/locations/${locationId}`

export type UseGetLocationResponse = {
	id: number
	name: string
	description?: string
	image?: {
		id: number
		url: string
	}
	location: {
		latitude: number
		longitude: number
	}
	type: LocationType
	visitors: Array<number>
}

export const useGetLocation = (locationId?: number | null) => {
	const fetchData = async (): Promise<UseGetLocationResponse> => {
		if (!locationId) {
			return Promise.reject("No player id provided")
		}

		const response = await fetch(getPath(locationId), {
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
		enabled: !!locationId,
		queryKey: locationId ? [locationId] : [],
	})
}
