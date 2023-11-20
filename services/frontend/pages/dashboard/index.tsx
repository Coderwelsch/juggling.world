import { SetupProfileSection } from "@/src/components/dashboard/components/setup-profile/setup-profile"
import { useUserNeedsSetup } from "@/src/components/dashboard/components/setup-profile/setup-profile-dialog"
import { DashboardLayout } from "@/src/components/dashboard/layout"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { UserProfileWrapper } from "@/src/hooks/data/user/use-profile-data"

const Dashboard = () => {
	const userNeedsSetup = useUserNeedsSetup()

	return (
		<DashboardLayout>
			<LoaderOverlay
				className={"z-10"}
				shown={userNeedsSetup === null}
			/>

			{!userNeedsSetup?.hasFinishedSetup && <SetupProfileSection />}
		</DashboardLayout>
	)
}

export default function DashboardPage() {
	return (
		<UserProfileWrapper>
			<Dashboard />
		</UserProfileWrapper>
	)
}
