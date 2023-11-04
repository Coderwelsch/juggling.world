import { auth, UserSessionData } from "@/pages/api/auth/[...nextauth]"
import { Button } from "@/src/components/button/button"
import { Panel } from "@/src/components/dashboard/components/panel/panel"
import { DashboardLayout } from "@/src/components/dashboard/layout"
import Dialog from "@/src/components/dialog/dialog"
import { Headline } from "@/src/components/headline/headline"
import { IconBxChevronRight } from "@/src/components/icons/bx-chevron-right"
import { apolloInternalClient } from "@/src/lib/clients/apollo-internal-client"
import { gql } from "@apollo/client"
import { GetServerSidePropsContext } from "next"
import { signOut } from "next-auth/react"
import { useState } from "react"

interface DashboardUserData {
	id: string
	attributes: {
		username: string
		email: string
		finishedSetup: boolean
		avatar: {
			data: {
				attributes: {
					url: string
				}
			}
		}
	}
}

export async function getServerSideProps(
	context: GetServerSidePropsContext,
): Promise<
	| {
			props: {
				userData: DashboardUserData
			}
	  }
	| {
			redirect: {
				destination: string
				permanent: boolean
			}
	  }
> {
	const session = await auth(context.req, context.res)

	if (!session) {
		return {
			redirect: {
				destination: "/signin",
				permanent: false,
			},
		}
	}

	const query = await apolloInternalClient.query({
		query: gql`
			query ($id: ID!) {
				usersPermissionsUser(id: $id) {
					data {
						id
						attributes {
							username
							email
							finishedSetup
							avatar {
								data {
									attributes {
										url
									}
								}
							}
						}
					}
				}
			}
		`,
		variables: {
			id: session.user.id,
		},
	})

	return {
		props: {
			userData: query.data?.usersPermissionsUser?.data,
		},
	}
}

interface DashboardProps {
	userData: DashboardUserData
}

export default function Dashboard({ userData }: DashboardProps) {
	console.log(userData)
	const [setupDialogVisible, setSetupDialogVisible] = useState(false)

	return (
		<DashboardLayout>
			<Dialog
				isVisible={setupDialogVisible}
				onClose={() => setSetupDialogVisible(false)}
			>
				<p className={"text-indigo-50"}>Hello, World!</p>
			</Dialog>

			{userData.attributes.finishedSetup !== true && (
				<Panel className={"text-space-50"}>
					<Headline>
						👋 Welcome, {userData.attributes.username}!
					</Headline>

					<p className={"leading-6 text-space-100"}>
						Nice to see you! It looks like it’s your first time
						here. To get you started we need to setup some
						information about your profile now
					</p>

					<div className={"flex items-center justify-center"}>
						<Button
							intent={"primary"}
							size={"md"}
							IconAfter={
								<IconBxChevronRight className={"h-6 w-6"} />
							}
							onClick={() => {
								setSetupDialogVisible(true)
							}}
						>
							Setup now
						</Button>
					</div>
				</Panel>
			)}
		</DashboardLayout>
	)
}
