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
			}
		}[]
	}
}

export const getPlayerQuery = (id: string) =>
	apolloClient.query<AllPlayersResponse>({
		query: gql`
			query {
				players: usersPermissionsUser(id: $ID) {
					data {
						id
						attributes {
							username
							publicContact {
								email
								facebook
								instagram
								reddit
								signal
								telegram
								whatsapp
							}
							disciplines {
								data {
									id
									attributes {
										isTeaching
										level
									}
								}
							}
							groups {
								data {
									id
									attributes {
										name
										description
										members {
											data {
												id
												attributes {
													username
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		`,
		variables: {
			ID: id,
		},
	})
