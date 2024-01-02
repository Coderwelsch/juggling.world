import { NEXT_PUBLIC_CMS_API_URL } from "@/src/lib/constants"
import { useQuery } from "@tanstack/react-query"

const getPath = (groupId: number) =>
	`${NEXT_PUBLIC_CMS_API_URL}/public/groups/${groupId}`

export interface UseGetGroupResponse {
	id: number
	name: string
	description?: string
	members: Array<number>
	publishedAt: string
	createdAt: string
	updatedAt: string
	location: {
		latitude: number
		longitude: number
	}
	avatar?: {
		url: string
	}
}

export const useGetGroup = (groupId?: number | null) => {
	const fetchData = async (): Promise<UseGetGroupResponse> => {
		if (!groupId) {
			return Promise.reject("No player id provided")
		}

		const response = await fetch(getPath(groupId), {
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
		enabled: !!groupId,
		queryKey: groupId ? [groupId] : [],
	})
}
