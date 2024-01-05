import { useAuthorizedRequest } from "@/src/hooks/data/auth/use-authorized-request"
import {
	Discipline,
	Enum_Userdiscipline_Level,
	Maybe,
	Scalars,
	UploadFile,
	UserDiscipline,
	UsersPermissionsRoleEntityResponse,
	UsersPermissionsUser,
} from "@/src/types/cms/graphql"
import { createContext, ReactNode, useContext } from "react"

export interface UserProfileData {
	id: number
	isAdmin?: boolean | null
	role: UsersPermissionsRoleEntityResponse | null
	avatar: UploadFile | null
	confirmed: UsersPermissionsUser["confirmed"]
	blocked: UsersPermissionsUser["blocked"]
	aboutMe: UsersPermissionsUser["aboutMe"]
	city: UsersPermissionsUser["city"]
	email: UsersPermissionsUser["email"]
	username: UsersPermissionsUser["username"]
	finishedSetup: UsersPermissionsUser["finishedSetup"]
	location: UsersPermissionsUser["location"]
	disciplines: Array<{
		createdAt?: Maybe<Scalars["DateTime"]["output"]>
		discipline?: Maybe<Discipline>
		isTeaching?: Maybe<Scalars["Boolean"]["output"]>
		level?: Maybe<Enum_Userdiscipline_Level>
		startedAt?: Maybe<Scalars["Date"]["output"]>
		updatedAt?: Maybe<Scalars["DateTime"]["output"]>
	}>
}
const UserProfileContext = createContext<UserProfileData | undefined>(undefined)

export const UserProfileProvider = UserProfileContext.Provider

export const useUserProfileContext = () => {
	return useContext(UserProfileContext)
}

export const useProfileData = () => {
	return useAuthorizedRequest<UserProfileData>({
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
