import { apolloClient } from "@/src/lib/clients/apollo-client"
import { gql } from "@apollo/client"

export interface AllPlayersResponse {
	players: {
		data: {
			id: string
			attributes: {
				username: string
				location: {
					latitude: number
					longitude: number
				}
				avatar?: {
					data: {
						attributes: {
							url: string
						}
					}
				}
			}
		}[]
	}
}

export const getAllPlayersQuery = () =>
	apolloClient.query<AllPlayersResponse>({
		query: gql`
			query {
				players: usersPermissionsUsers(
					filters: { confirmed: { eq: true }, blocked: { eq: false } }
				) {
					data {
						id
						attributes {
							username
							avatar {
								data {
									attributes {
										url
									}
								}
							}
							location {
								latitude
								longitude
							}
						}
					}
				}
			}
		`,
	})
