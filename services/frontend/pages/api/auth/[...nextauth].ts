import { apolloInternalClient } from "@/src/lib/clients/apollo-internal-client"
import {
	UsersPermissionsLoginInput,
	UsersPermissionsUser,
} from "@/src/types/cms/graphql"
import { gql } from "@apollo/client"
import { ID } from "graphql-ws"
import {
	GetServerSidePropsContext,
	NextApiRequest,
	NextApiResponse,
} from "next"
import NextAuth, { getServerSession, NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export function auth(
	...args:
		| [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
		| [NextApiRequest, NextApiResponse]
		| []
) {
	const session = getServerSession<
		NextAuthOptions,
		{ user: UserSessionData }
	>(...args, authOptions)

	return session
}

const loginUser = async (credentials: UsersPermissionsLoginInput) => {
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

export type UserSessionData = {
	id: ID
	data: Pick<
		UsersPermissionsUser,
		"blocked" | "avatar" | "confirmed" | "username" | "role"
	>
}

const getUserData = async (
	id: string,
): Promise<null | { id: string; attributes: UserSessionData }> => {
	const res = await apolloInternalClient.query({
		query: gql`
			query ($id: ID!) {
				usersPermissionsUser(id: $id) {
					data {
						id
						attributes {
							username
							email
							confirmed
							blocked
							avatar {
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
		variables: {
			id,
		},
	})

	// If no error and we have user data, return it
	if (res.data) {
		return res.data.usersPermissionsUser.data
	}

	return null
}

export const authOptions: NextAuthOptions = {
	debug: process.env.NODE_ENV === "development",
	pages: {
		signIn: "/signin",
		newUser: "/signup",
		signOut: "/signout",
		error: "/error",
	},
	callbacks: {
		session: async ({ session, token }) => {
			if (!token.sub) {
				return Promise.resolve(session)
			}

			const user = await getUserData(token.sub)

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			session.user = {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				id: user.id,
				data: user?.attributes,
			}

			return Promise.resolve(session)
		},
	},
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				identifier: {
					label: "Username or email",
					type: "text",
					placeholder: "jsmith",
				},
				password: { label: "Password", type: "password" },
			},
			type: "credentials",
			authorize: async function (_credentials, req) {
				if (!req.query?.identifier || !req.query?.password) {
					return null
				}

				const credentials = {
					identifier: req.query.identifier,
					password: req.query.password,
				}

				try {
					const user = await loginUser(credentials)

					// If no error and we have user data, return it
					if (user) {
						return {
							id: user.id,
							jwt: user.jwt,
						}
					}
				} catch (error) {
					console.log(error)
				}

				// Return null if user data could not be retrieved
				return null
			},
		}),
	],
}

export default NextAuth(authOptions)
