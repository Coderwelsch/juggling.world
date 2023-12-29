import { useUserSession } from "@/src/components/dashboard/hooks/use-user-session"
import { errorToast } from "@/src/components/toast/toast"
import { NEXT_PUBLIC_CMS_API_URL } from "@/src/lib/constants"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export interface UseAuthorizedMutationProps {
	path: string
	invalidationKeys?: string[]
	authOptions?: RequestInit
	onMutate?: () => void
	onError?: (error: ErrorResponse) => void
}

export type ErrorResponse = {
	error?: {
		details: Record<string, unknown>
		message: string
		name: string
		status: number
	}
}

export const useAuthorizedMutation = <
	MutationParams extends FormData,
	ResponseType extends ErrorResponse,
>({
	path,
	invalidationKeys,
	authOptions = {},
	onMutate,
	onError,
}: UseAuthorizedMutationProps) => {
	const user = useUserSession()
	const queryClient = useQueryClient()

	return useMutation<ResponseType, any, MutationParams>({
		mutationKey: [path],
		onMutate,
		onSuccess: (response) => {
			if (response.error) {
				if (onError) {
					onError(response)
				}

				throw response
			}

			invalidationKeys?.forEach((key) => {
				queryClient.invalidateQueries({
					queryKey: [key],
				})
			})
		},
		onError:
			onError ||
			(({ error }: ErrorResponse) => {
				console.error(error)

				if (!error) {
					return errorToast({
						message: "An unknown error occurred.",
					})
				}

				if (error?.status === 401) {
					return errorToast({
						message:
							"You are not authorized to perform this action.",
					})
				}

				if (error.status === 403) {
					return errorToast({
						message:
							"You don't have permission to perform this action.",
					})
				}

				return errorToast({
					title: `${error.name} (${error.status}):` || "Error:",
					message: error.message,
				})
			}),
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
