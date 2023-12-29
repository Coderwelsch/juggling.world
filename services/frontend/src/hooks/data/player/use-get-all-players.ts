import { NEXT_PUBLIC_CMS_API_URL } from "@/src/lib/constants"
import { useQuery } from "@tanstack/react-query"

const path = `${NEXT_PUBLIC_CMS_API_URL}/public/players`

export type UseGetAllPlayersResponse = Array<{
	id: number
	username: string
	location: {
		latitude: number
		longitude: number
	}
	groups: Array<number>
	adminGroups: Array<number>
	avatar?: {
		id: number
		url: string
	}
	disciplines: Array<number>
	playLocations: Array<number>
}>

export const useGetAllPlayers = () => {
	const fetchData = async (): Promise<UseGetAllPlayersResponse> => {
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
