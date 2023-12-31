import { auth } from "@/pages/api/auth/[...nextauth]"
import { Panel } from "@/src/components/dashboard/components/panel/panel"
import { DashboardLayout } from "@/src/components/dashboard/layout"
import { Headline } from "@/src/components/headline/headline"
import { apolloInternalClient } from "@/src/lib/clients/apollo-internal-client"
import { gql } from "@apollo/client"
import { GetServerSidePropsContext } from "next"

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
	const userSessionData = await auth()

	if (!userSessionData) {
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
			id: userSessionData.id,
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
	return (
		<DashboardLayout>
			{userData.attributes.finishedSetup !== true && (
				<Panel className={"text-densed-50"}>
					<Headline>Locations</Headline>
				</Panel>
			)}
		</DashboardLayout>
	)
}
