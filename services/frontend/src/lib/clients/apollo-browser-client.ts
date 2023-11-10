import { NEXT_PUBLIC_CMS_GRAPHQL_API_URL } from "@/src/lib/constants"
import { ApolloClient, InMemoryCache } from "@apollo/client"

export const apolloBrowserClient = new ApolloClient({
	uri: NEXT_PUBLIC_CMS_GRAPHQL_API_URL,
	cache: new InMemoryCache(),
})
