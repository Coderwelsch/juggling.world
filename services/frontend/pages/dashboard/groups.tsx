import { Button } from "@/src/components/button/button"
import { CreateGroupForm } from "@/src/components/dashboard/components/groups/create-group/create-group-form"
import { GroupActivities } from "@/src/components/dashboard/components/groups/group-activities/group-activities"
import { DashboardLayout } from "@/src/components/dashboard/layout"
import { Headline } from "@/src/components/headline/headline"
import IconAddCircle from "@/src/components/icons/add-circle"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { useGetOwnGroups } from "@/src/hooks/data/user/use-get-own-groups"
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

const Groups = () => {
	const userGroups = useGetOwnGroups()

	return (
		<DashboardLayout>
			<LoaderOverlay
				className={"z-10"}
				shown={userGroups.isLoading}
			/>

			<div className={"flex flex-col gap-4"}>
				<Headline size={1}>Your groups</Headline>

				<p className={"text-neutral-100/60"}>
					Groups are perfect ways to organize your freetime activities
					with your friends or to find new people by joining existing
					ones.
				</p>

				<div className={"flex items-center justify-center"}>
					<Button
						variant={"text"}
						intent={"neutral"}
						IconBefore={<IconAddCircle />}
					>
						Create a new group
					</Button>
				</div>
			</div>

			{!userGroups.data?.length ? (
				<CreateGroupForm />
			) : (
				<GroupActivities />
			)}
		</DashboardLayout>
	)
}

export default function DashboardPage() {
	return (
		<UserProfileWrapper>
			<Groups />
		</UserProfileWrapper>
	)
}
