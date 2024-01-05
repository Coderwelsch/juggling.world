import { CreateGroupForm } from "@/src/components/dashboard/components/groups/create-group/create-group-form"
import { GroupActivities } from "@/src/components/dashboard/components/groups/group-activities/group-activities"
import { SetupProfileSection } from "@/src/components/dashboard/components/setup-profile/setup-profile"
import { Headline } from "@/src/components/headline/headline"
import { useGetOwnGroups } from "@/src/hooks/data/user/use-get-own-groups"

import { useUserNeedsSetup } from "@/src/hooks/data/user/use-user-needs-setup"
import { DashboardLayout } from "@/src/components/dashboard/layout"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import {
	UserProfileWrapper,
	useUserProfileContext,
} from "@/src/hooks/data/user/use-profile-data"
import { META_APP_NAME } from "@/src/lib/constants"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Link from "next/link"

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
	const user = useUserProfileContext()
	const userNeedsSetup = useUserNeedsSetup()
	const userGroups = useGetOwnGroups()

	return (
		<DashboardLayout>
			<LoaderOverlay
				className={"z-10"}
				shown={userNeedsSetup === null}
			/>

			<div className={"flex flex-col gap-4"}>
				<Headline size={1}>Hi 👋, {user?.username}!</Headline>

				<p className={"text-neutral-100/60"}>
					Nice to see you at{" "}
					<strong className={"text-primary-500"}>
						{META_APP_NAME}
					</strong>{" "}
					– your all new platform to meet your buddies and new people.
					Let’s get out and do some digital detoxing!
				</p>

				<p className={"text-neutral-100/60"}>
					<Link
						href={"/about"}
						target={"_blank"}
						className={"link"}
					>
						Read more about our goals →
					</Link>
				</p>
			</div>

			{/*
			    dont optionally render this component because when setup is done it
			    would get removed immateriality, which we won’t have
			*/}
			<SetupProfileSection />

			{userNeedsSetup?.hasFinishedSetup && (
				<>
					{!userGroups.data?.length ? (
						<CreateGroupForm />
					) : (
						<GroupActivities />
					)}
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
