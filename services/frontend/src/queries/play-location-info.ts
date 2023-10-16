import { gql } from "@apollo/client"

export interface PlayLocationResponse {
	location: {
		data: {
			id: string
			attributes: {
				name: string
				createdAt: string
				description?: string
				updatedAt: string
				location: {
					latitude: number
					longitude: number
				}
				image: {
					data: {
						attributes: {
							name: string
							url: string
						}
					}
				}
				users?: {
					data: {
						id: string
					}[]
				}
			}
		}
	}
}

export const playLocationQuery = gql`
	query ($id: ID!) {
		location: userPlayLocation(id: $id) {
			data {
				id
				attributes {
					name
					createdAt
					updatedAt
					description
					location {
						latitude
						longitude
					}
					image {
						data {
							attributes {
								name
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
