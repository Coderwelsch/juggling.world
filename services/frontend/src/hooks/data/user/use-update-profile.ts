import {
	ErrorResponse,
	useAuthorizedMutation,
} from "@/src/hooks/data/auth/use-authorized-mutation"
import { UserProfileData } from "@/src/hooks/data/user/use-profile-data"

export const useUpdateProfileMutation = () => {
	return useAuthorizedMutation<FormData, UserProfileData & ErrorResponse>({
		path: "/user/me",
		invalidationKeys: ["/user/me"],
		authOptions: {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
		},
	})
}
