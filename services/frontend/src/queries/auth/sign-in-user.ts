import { apolloInternalClient } from "@/src/lib/clients/apollo-internal-client"
import { UsersPermissionsLoginInput } from "@/src/types/cms/graphql"
import { gql } from "@apollo/client"

export const signInUser = async (credentials: UsersPermissionsLoginInput) => {
	const res = await apolloInternalClient.mutate({
		mutation: gql`
			mutation ($input: UsersPermissionsLoginInput!) {
				login(input: $input) {
					user {
						id
						confirmed
						blocked
						role {
							id
							name
						}
					}
					jwt
				}
			}
		`,
		variables: {
			input: credentials,
		},
	})

	const user = res.data.login.user
	const jwt = res.data.login.jwt

	// If no error and we have user data, return it
	if (user) {
		return {
			id: user.id,
			jwt,
		}
	}

	return null
}
