import { gql, useQuery } from "@apollo/client"

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

export const useAllDisciplines = () => {
	return useQuery<AllDisciplinesResponse>(gql`
		query AllDisciplines {
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
	`)
}
