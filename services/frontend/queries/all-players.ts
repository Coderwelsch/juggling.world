import { apolloClient } from "@/lib/clients/apollo-client";
import { gql } from "@apollo/client";

export const getAllPlayersQuery = () =>
	apolloClient.query({
		query: gql`
			query {
				players: usersPermissionsUsers(
					filters: { confirmed: { eq: true }, blocked: { eq: false } }
				) {
					data {
						id
						attributes {
							username
							confirmed
							blocked
							location {
								latitude
								longitude
							}
							disciplines {
								data {
									attributes {
										level
										is_teaching
										discipline {
											data {
												id
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
	});
