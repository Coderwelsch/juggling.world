import {
	CMS_API_ACCESS_TOKEN,
	INTERNAL_CMS_GRAPHQL_API_URL,
} from "@/src/lib/constants"
import { ApolloClient, InMemoryCache } from "@apollo/client"

export const apolloInternalClient = new ApolloClient({
	uri: INTERNAL_CMS_GRAPHQL_API_URL,
	cache: new InMemoryCache(),
	headers: {
		Authorization: `Bearer ${CMS_API_ACCESS_TOKEN}`,
	},
})
