import { NODE_ENV } from "@/src/lib/constants"
import { signInUser } from "@/src/queries/auth/sign-in-user"
import { queryMe } from "@/src/queries/protected/user/me"
import { UsersPermissionsUser } from "@/src/types/cms/graphql"
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

export type UserSessionData = {
	id: ID
	data: Pick<
		UsersPermissionsUser,
		"blocked" | "avatar" | "confirmed" | "username" | "role"
	>
	jwt: string
}

export const authOptions: NextAuthOptions = {
	debug: NODE_ENV === "development",
	pages: {
		signIn: "/signin",
		newUser: "/signup",
		signOut: "/signout",
		error: "/error",
	},
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user, account }) {
			// @ts-ignore
			if (user?.jwt) {
				// @ts-ignore
				token.accessToken = user.jwt
			}

			return token
		},
		session: async ({ session, token }) => {
			if (!session || !token.sub) {
				return Promise.resolve(session)
			}

			const userId = token.sub
			const user = await queryMe(userId)

			// @ts-ignore
			session.user = {
				// @ts-ignore
				id: user.id,
				data: user?.attributes,
				jwt: token.accessToken,
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
			authorize: async function (_c, req) {
				if (!req.query?.identifier || !req.query?.password) {
					return null
				}

				const credentials = {
					identifier: req.query.identifier,
					password: req.query.password,
				}

				try {
					const user = await signInUser(credentials)

					if (user?.jwt) {
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
