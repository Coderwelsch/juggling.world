import { gql } from "@apollo/client"

export interface UserCreationMutationInput {
	username: string
	email: string
	password: string
}

export interface UserCreationMutationResponse {
	register: {
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

export const createUserQuery = gql`
	mutation ($input: UsersPermissionsRegisterInput!) {
		register(input: $input) {
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
		}
	}
`
