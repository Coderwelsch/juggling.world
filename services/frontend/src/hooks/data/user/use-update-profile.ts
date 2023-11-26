import { useAuthorizedMutation } from "@/src/hooks/data/user/use-authorized-mutation"
import { UserProfileData } from "@/src/hooks/data/user/use-profile-data"

export const useUpdateProfileMutation = () => {
	return useAuthorizedMutation<BodyInit, UserProfileData>({
		path: "/user/me",
		invalidationKeys: ["user/me"],
		authOptions: {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
		},
	})
}
