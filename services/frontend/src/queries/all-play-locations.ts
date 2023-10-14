import { gql } from "@apollo/client"

export interface AllPlayLocationsResponse {
	locations: {
		data: {
			id: string
			attributes: {
				name: string
				image?: {
					data: {
						attributes: {
							url: string
						}
					}
				}
				location: {
					latitude: number
					longitude: number
				}
				users?: {
					data: {
						id: string
					}[]
				}
			}
		}[]
	}
}

export const allPlayLocationsQuery = gql`
	query {
		locations: userPlayLocations(
			filters: {
				location: { latitude: { ne: null }, longitude: { ne: null } }
			}
		) {
			data {
				id
				attributes {
					name
					location {
						latitude
						longitude
					}
					image {
						data {
							attributes {
								url
							}
						}
					}
					users {
						data {
							id
						}
					}
				}
			}
		}
	}
`
