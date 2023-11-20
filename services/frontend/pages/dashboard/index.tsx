import { SetupProfileSection } from "@/src/components/dashboard/components/setup-profile/setup-profile"
import { useUserNeedsSetup } from "@/src/components/dashboard/components/setup-profile/setup-profile-dialog"
import { DashboardLayout } from "@/src/components/dashboard/layout"


export default function Dashboard() {
	const userNeedsSetup = useUserNeedsSetup()

	return (
		<DashboardLayout>
			{!userNeedsSetup?.hasFinishedSetup && <SetupProfileSection />}
		</DashboardLayout>
	)
}
