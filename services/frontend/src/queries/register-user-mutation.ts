import { apolloClient } from "@/src/lib/clients/apollo-client"
import { gql } from "@apollo/client"

export interface UserCreationMutation {
	username: string
	email: string
	password: string
}

export const createUser = (data: UserCreationMutation) =>
	apolloClient.mutate<UserCreationMutation>({
		mutation: gql`
			mutation {
				register(
					input: {
						username: $username
						email: $email
						password: $password
					}
				) {
					jwt
					user {
						id
						username
						email
						confirmed
						blocked
						role
					}
				}
			}
		`,
		variables: data,
	})
