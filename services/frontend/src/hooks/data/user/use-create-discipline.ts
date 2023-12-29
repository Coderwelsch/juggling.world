import {
	ErrorResponse,
	useAuthorizedMutation,
} from "@/src/hooks/data/auth/use-authorized-mutation"
import { UserDisciplineEntity } from "@/src/types/cms/graphql"

export const useCreateDiscipline = (
	props?: { onMutate?: () => void } | undefined,
) => {
	return useAuthorizedMutation<
		FormData,
		UserDisciplineEntity & ErrorResponse
	>({
		path: "/user/discipline",
		invalidationKeys: ["/user/discipline", "/user/me"],
		authOptions: {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
		},
		onMutate: props?.onMutate,
	})
}
