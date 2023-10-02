import { ApolloClient, InMemoryCache } from "@apollo/client"

export const apolloBrowserClient = new ApolloClient({
	uri: process.env.NEXT_PUBLIC_CMS_GRAPHQL_API_URL,
	cache: new InMemoryCache(),
})
