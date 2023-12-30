import { NEXT_PUBLIC_CMS_API_URL } from "@/src/lib/constants"
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
	users: [
		{
			id: 1
		},
		{
			id: 2
		},
	]
	visitors: [1, 2]
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