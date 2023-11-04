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
				userPlayLocations: {
					data: {
						id: string
					}[]
				}
				disciplines: {
					data: {
						id: string
					}[]
				}
				city: string
				avatar?: {
					data?: {
						attributes: {
							url: string
						}
					}
				}
			}
		}[]
	}
}

export const allPlayersQuery = gql`
	query {
		players: usersPermissionsUsers(
			filters: {
				confirmed: { eq: true }
				blocked: { eq: false }
				location: { latitude: { not: null }, longitude: { not: null } }
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
					disciplines {
						data {
							id
						}
					}
					userPlayLocations {
						data {
							id
						}
					}
				}
			}
		}
	}
`
