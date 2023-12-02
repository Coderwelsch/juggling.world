import {
	ErrorResponse,
	useAuthorizedMutation,
} from "@/src/hooks/data/auth/use-authorized-mutation"
import { UploadFile } from "@/src/types/cms/graphql"

export const useUpdateAvatar = (
	props?: { onMutate?: () => void } | undefined,
) => {
	return useAuthorizedMutation<FormData, UploadFile & ErrorResponse>({
		path: "/user/avatar",
		invalidationKeys: ["/user/me"],
		authOptions: {
			method: "PUT",
		},
		onMutate: props?.onMutate,
	})
}
