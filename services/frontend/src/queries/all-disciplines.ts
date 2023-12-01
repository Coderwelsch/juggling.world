import { gql, useQuery } from "@apollo/client"

export interface AllDisciplinesResponse {
	disciplines: {
		data: {
			id: number
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
				meta {
					pagination {
						total
					}
				}
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
