import { UserSessionData } from "@/pages/api/auth/[...nextauth]"
import { useSession } from "next-auth/react"

export const useUserSession = () => {
	const session = useSession()

	if (!session.data?.user) {
		return null
	}

	return session.data.user as UserSessionData
}
