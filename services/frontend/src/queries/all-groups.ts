import { gql } from "@apollo/client"


export interface AllGroupsResponse {
	groups: {
		data: {
			id: string
			attributes: {
				name: string
				description?: string
				createdAt: string
				updatedAt: string
				location: {
					latitude: number
					longitude: number
				}
				avatar: {
					data: {
						attributes: {
							name: string
							url: string
						}
					}
				}
				members?: {
					data: {
						id: string
					}[]
				}
			}
		}[]
	}
}


export const allGroupsQuery = gql`
	query {
		groups: userGroups(publicationState: LIVE) {
			data {
				id
				attributes {
					name
					location {
						latitude
						longitude
					}
					avatar {
						data {
							attributes {
								name
								url
							}
						}
					}
					members {
						data {
							id
						}
					}
				}
			}
		}
	}
`
