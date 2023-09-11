import { apolloClient } from "@/lib/clients/apollo-client"
import { gql } from "@apollo/client"


export const getAllDisciplinesQuery = () => apolloClient.query({
	query: gql`
		query {
			disciplines (
				sort: "updatedAt:asc"
			) {
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