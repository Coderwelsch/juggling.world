import { UserSessionData } from "@/pages/api/auth/[...nextauth]"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export const useUserSession = () => {
	const session = useSession()

	if (session.status === "loading") {
		return null
	}

	if (session.status === "unauthenticated") {
		// redirect to login
		return redirect("/signin")
	}

	if (!session.data?.user) {
		return null
	}

	return session.data.user as UserSessionData
}
