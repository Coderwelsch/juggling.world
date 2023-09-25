import { apolloClient } from "@/src/lib/clients/apollo-client"
import { gql } from "@apollo/client"

export interface AllDisciplinesResponse {
	disciplines: {
		data: {
			id: string
			attributes: {
				name: string
				slug: string
				icon?: {
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

export const getAllDisciplinesQuery = () =>
	apolloClient.query<AllDisciplinesResponse>({
		query: gql`
			query {
				disciplines(sort: "updatedAt:asc") {
					data {
						id
						attributes {
							name
							slug
							icon {
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
	})
