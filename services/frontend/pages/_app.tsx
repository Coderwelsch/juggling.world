import { classNames } from "@/src/lib/class-names"
import { apolloBrowserClient } from "@/src/lib/clients/apollo-browser-client"
import { apolloInternalClient } from "@/src/lib/clients/apollo-internal-client"
import { QueryClientProvider } from "@/src/lib/clients/tanstack-query"
import { NODE_ENV } from "@/src/lib/constants"
import { poppinsFont } from "@/src/lib/fonts"
import "@/styles/globals.css"
import { ApolloProvider } from "@apollo/client"
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev"
import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"

// load apollo error messages
if (NODE_ENV === "development") {
	loadDevMessages()
	loadErrorMessages()
}

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SessionProvider session={pageProps.session}>
			<ApolloProvider client={apolloInternalClient}>
				<ApolloProvider client={apolloBrowserClient}>
					<QueryClientProvider>
						<main
							className={classNames(
								poppinsFont.variable,
								"font-sans h-full",
							)}
						>
							<Component {...pageProps} />
						</main>
					</QueryClientProvider>
				</ApolloProvider>
			</ApolloProvider>
		</SessionProvider>
	)
}
