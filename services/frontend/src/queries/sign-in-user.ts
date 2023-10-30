import { UsersPermissionsLoginInput } from "@/src/types/cms/graphql"
import { gql } from "@apollo/client"

export interface UserSignInMutationInput extends UsersPermissionsLoginInput {}

export interface UserSignInMutationResponse {
	login: {
		user: {
			id: string
			username: string
			email: string
			confirmed: boolean
			blocked: boolean
			role: {
				id: string
				name: string
			}
		}
	}
}

export const signInUserQuery = gql`
	mutation ($input: UsersPermissionsLoginInput!) {
		login(input: $input) {
			user {
				id
				username
				email
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
`
