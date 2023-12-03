import { CreateAGroup } from "@/src/components/dashboard/components/create-a-group/create-a-group"
import { SetupProfileSection } from "@/src/components/dashboard/components/setup-profile/setup-profile"

import { useUserNeedsSetup } from "@/src/hooks/data/user/use-user-needs-setup"
import { DashboardLayout } from "@/src/components/dashboard/layout"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { UserProfileWrapper } from "@/src/hooks/data/user/use-profile-data"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context)

	if (!session) {
		return {
			redirect: {
				destination: "/signin",
				permanent: false,
			},
		}
	}

	return {
		props: {},
	}
}

const Dashboard = () => {
	const userNeedsSetup = useUserNeedsSetup()

	return (
		<DashboardLayout>
			<LoaderOverlay
				className={"z-10"}
				shown={userNeedsSetup === null}
			/>

			<SetupProfileSection />

			{userNeedsSetup?.hasFinishedSetup && (
				<>
					<CreateAGroup />
				</>
			)}
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
