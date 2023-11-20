import { useAuthorizedMutation } from "@/src/hooks/data/user/use-authorized-request"
import { UploadFile } from "@/src/types/cms/graphql"

export const useUpdateAvatar = () => {
	return useAuthorizedMutation<FormData, UploadFile>({
		path: "/user/avatar",
		invalidationKeys: ["/user/me"],
		authOptions: {
			method: "PUT",
		},
	})
}
