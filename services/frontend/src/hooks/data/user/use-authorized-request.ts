import { useUserSession } from "@/src/components/dashboard/hooks/use-user-session"
import { NEXT_PUBLIC_CMS_API_URL } from "@/src/lib/constants"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface UseAuthorizedQueryProps {
	path: string
	enabled?: boolean
	authOptions?: RequestInit
	data?: BodyInit
}

export const useAuthorizedQuery = <ResponseType = any, QueryParams = BodyInit>({
	path,
	data,
	enabled = true,
	authOptions = {},
}: UseAuthorizedQueryProps) => {
	const user = useUserSession()

	const fetchData = async (): Promise<ResponseType> => {
		if (!user) {
			throw new Error("No user session")
		}

		const response = await fetch(`${NEXT_PUBLIC_CMS_API_URL}${path}`, {
			method: "GET",
			body: data,
			...authOptions,
			headers: {
				Authorization: `Bearer ${user.jwt}`,
				"Content-Type": "application/json",
				...authOptions.headers,
			},
		})

		const json = await response.json()
		return json as ResponseType
	}

	return useQuery({
		enabled: Boolean(user && enabled),
		queryFn: async (context) => {
			return fetchData()
		},
		queryKey: [path],
	})
}

interface UseAuthorizedMutationProps {
	path: string
	invalidationKeys?: string[]
	authOptions?: RequestInit
}

export const useAuthorizedMutation = <
	MutationParams extends BodyInit,
	ResponseType = unknown,
>({
	path,
	invalidationKeys,
	authOptions = {},
}: UseAuthorizedMutationProps) => {
	const user = useUserSession()
	const queryClient = useQueryClient()

	return useMutation<ResponseType, unknown, MutationParams>({
		mutationKey: [path],
		onSuccess: () => {
			invalidationKeys?.forEach((key) => {
				queryClient.invalidateQueries({
					queryKey: [key],
				})
			})
		},
		mutationFn: async (data: MutationParams) => {
			if (!user) {
				throw new Error("No user session")
			}

			const response = await fetch(`${NEXT_PUBLIC_CMS_API_URL}${path}`, {
				method: "PUT",
				body: data,
				...authOptions,
				headers: {
					Authorization: `Bearer ${user.jwt}`,
					...authOptions.headers,
				},
			})

			return (await response.json()) as ResponseType
		},
	})
}
