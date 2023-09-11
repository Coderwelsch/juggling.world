import { ApolloClient, InMemoryCache } from "@apollo/client"


export const apolloClient = new ApolloClient({
	uri: process.env.INTERNAL_CMS_GRAPHQL_API_URL,
	cache: new InMemoryCache(),
	typeDefs: "",
	headers: {
		Authorization: `Bearer ${process.env.CMS_API_ACCESS_TOKEN}`,
	},
})