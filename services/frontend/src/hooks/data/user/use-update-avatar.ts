import { useAuthorizedMutation } from "@/src/hooks/data/user/use-authorized-mutation"
import { UploadFile } from "@/src/types/cms/graphql"

export const useUpdateAvatar = (
	props?: { onMutate?: () => void } | undefined,
) => {
	return useAuthorizedMutation<FormData, UploadFile>({
		path: "/user/avatar",
		invalidationKeys: ["/user/me"],
		authOptions: {
			method: "PUT",
		},
		onMutate: props?.onMutate,
	})
}
