import { useAuthorizedQuery } from "@/src/hooks/data/user/use-authorized-request"
import { UsersPermissionsUser } from "@/src/types/cms/graphql"

export interface UserProfileData
	extends Pick<
		UsersPermissionsUser,
		| "role"
		| "avatar"
		| "confirmed"
		| "blocked"
		| "aboutMe"
		| "city"
		| "email"
		| "username"
		| "finishedSetup"
		| "location"
		| "updatedAt"
		| "disciplines"
	> {
	id: number
}

export const useProfileData = () => {
	return useAuthorizedQuery<UserProfileData>({
		path: "/user/me",
	})
}
