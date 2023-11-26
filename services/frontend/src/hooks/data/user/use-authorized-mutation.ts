import { useUserSession } from "@/src/components/dashboard/hooks/use-user-session"
import { NEXT_PUBLIC_CMS_API_URL } from "@/src/lib/constants"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export interface UseAuthorizedMutationProps {
	path: string
	invalidationKeys?: string[]
	authOptions?: RequestInit
	onMutate?: () => void
}

export const useAuthorizedMutation = <
	MutationParams extends BodyInit,
	ResponseType = unknown,
>({
	path,
	invalidationKeys,
	authOptions = {},
	onMutate,
}: UseAuthorizedMutationProps) => {
	const user = useUserSession()
	const queryClient = useQueryClient()

	return useMutation<ResponseType, unknown, MutationParams>({
		mutationKey: [path],
		onMutate,
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
