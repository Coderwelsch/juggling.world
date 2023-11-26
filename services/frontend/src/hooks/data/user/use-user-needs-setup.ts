import { useUserProfileContext } from "@/src/hooks/data/user/use-profile-data"

export const useUserNeedsSetup = () => {
	const user = useUserProfileContext()

	if (!user) {
		return null
	}

	const checks = {
		avatar: user.avatar !== null,
		location: user.location !== null,
		aboutMe: user.aboutMe !== null,
		disciplines: Boolean(user.disciplines),
	}

	return {
		hasFinishedSetup: Object.values(checks).every((value) => !value),
		checks,
	}
}
