import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
	debug: true,
	pages: {
		signIn: "/signin",
		newUser: "/signup",
		signOut: "/signout",
		error: "/error",
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
					const res = await fetch("http://strapi/graphql", {
						method: "POST",
						body: JSON.stringify({
							query: `
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
							`,
							variables: {
								input: credentials,
							},
						}),
						headers: { "Content-Type": "application/json" },
					})

					const user = await res.json()

					// If no error and we have user data, return it
					if (res.ok && user) {
						return user.data.login
					}
				} catch (error) {
					console.log(error)
				}

				// Return null if user data could not be retrieved
				return null
			},
		}),
	],
})
