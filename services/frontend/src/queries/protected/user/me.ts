import { apolloInternalClient } from "@/src/lib/clients/apollo-internal-client"
import { gql } from "@apollo/client"

export interface UserMeData {
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

export const queryMe = async (id: string) => {
	const result = await apolloInternalClient.query<{
		usersPermissionsUser: {
			data: UserMeData
		}
	}>({
		query: gql`
			query ($id: ID!) {
				usersPermissionsUser(id: $id) {
					data {
						id
						attributes {
							username
							email
							finishedSetup
							confirmed
							blocked
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
			id: id,
		},
	})

	return result.data.usersPermissionsUser.data
}
