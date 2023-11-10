import { UserMeData } from "@/src/queries/protected/user/me"
import { Context, createContext, useContext } from "react"

const createUserSessionContext = <T,>() => {
	return createContext<T | null>(null)
}

const UserContext: Context<UserMeData | null> = createUserSessionContext()

export const UserSessionProvider = UserContext.Provider

export const useUserContext = () => {
	return useContext<UserMeData | null>(UserContext)
}
