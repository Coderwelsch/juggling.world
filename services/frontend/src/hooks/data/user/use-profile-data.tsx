import { useAuthorizedQuery } from "@/src/hooks/data/user/use-authorized-request"
import {
	UploadFile,
	UserDisciplineEntityResponseCollection,
	UsersPermissionsRoleEntityResponse,
	UsersPermissionsUser,
} from "@/src/types/cms/graphql"
import { createContext, ReactNode, useContext } from "react"

export interface UserProfileData {
	id: number
	role: UsersPermissionsRoleEntityResponse | null
	avatar: UploadFile | null
	confirmed: UsersPermissionsUser["confirmed"]
	blocked: UsersPermissionsUser["blocked"]
	aboutMe: UsersPermissionsUser["aboutMe"]
	city: UsersPermissionsUser["city"]
	email: UsersPermissionsUser["email"]
	username: UsersPermissionsUser["username"]
	provider: UsersPermissionsUser["provider"]
	finishedSetup: UsersPermissionsUser["finishedSetup"]
	location: UsersPermissionsUser["location"]
	updatedAt: UsersPermissionsUser["updatedAt"]
	createdAt: UsersPermissionsUser["createdAt"]
	disciplines: UserDisciplineEntityResponseCollection | null
}

const UserProfileContext = createContext<UserProfileData | undefined>(undefined)

export const UserProfileProvider = UserProfileContext.Provider

export const useUserProfileContext = () => {
	return useContext(UserProfileContext)
}

export const useProfileData = () => {
	return useAuthorizedQuery<UserProfileData>({
		path: "/user/me",
	})
}

interface UserProfileWrapperProps {
	children: ReactNode
}

export const UserProfileWrapper = ({ children }: UserProfileWrapperProps) => {
	const { data } = useProfileData()

	return <UserProfileProvider value={data}>{children}</UserProfileProvider>
}
