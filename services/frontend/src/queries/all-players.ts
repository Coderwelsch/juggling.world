import { apolloInternalClient } from "@/src/lib/clients/apollo-internal-client"
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
				city: string
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
	apolloInternalClient.query<AllPlayersResponse>({
		query: gql`
			query {
				players: usersPermissionsUsers(
					filters: {
						confirmed: { eq: true }
						blocked: { eq: false }
						location: {
							latitude: { not: null }
							longitude: { not: null }
						}
					}
				) {
					data {
						id
						attributes {
							username
							city
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
