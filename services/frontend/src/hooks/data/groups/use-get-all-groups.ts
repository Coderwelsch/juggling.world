import { NEXT_PUBLIC_CMS_API_URL } from "@/src/lib/constants"
import { useQuery } from "@tanstack/react-query"

const path = `${NEXT_PUBLIC_CMS_API_URL}/public/groups`

export type UseGetAllGroupsResponse = Array<{
	id: number
	name: string
	description?: string
	members: Array<number>
	admins: Array<number>
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
}>

export const useGetAllGroups = () => {
	const fetchData = async (): Promise<UseGetAllGroupsResponse> => {
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
