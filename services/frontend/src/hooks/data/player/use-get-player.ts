import { NEXT_PUBLIC_CMS_API_URL } from "@/src/lib/constants"
import { useQuery } from "@tanstack/react-query"

const getPath = (playerId: number) =>
	`${NEXT_PUBLIC_CMS_API_URL}/public/players/${playerId}`

export type UseGetPlayerResponse = {
	id: number
	username: string
	aboutMe?: string
	city?: string
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
	disciplines: Array<{
		id: number
		name: string
		icon?: {
			id: number
			url: string
		}
	}>
	playLocations: Array<{
		id: number
		name: string
		avatar?: {
			id: number
			url: string
		}
	}>
}

export const useGetPlayer = (playerId?: number | null) => {
	const fetchData = async (): Promise<UseGetPlayerResponse> => {
		if (!playerId) {
			return Promise.reject("No player id provided")
		}

		const response = await fetch(getPath(playerId), {
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
		enabled: !!playerId,
		queryKey: playerId ? [playerId] : [],
	})
}
