import "@/styles/globals.css"
import { classNames } from "@/src/lib/class-names"
import { apolloBrowserClient } from "@/src/lib/clients/apollo-browser-client"
import { apolloInternalClient } from "@/src/lib/clients/apollo-internal-client"
import { poppinsFont } from "@/src/lib/fonts"
import { ApolloProvider } from "@apollo/client"
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev"
import type { AppProps } from "next/app"

// load apollo error messages
if (process.env.NODE_ENV === "development") {
	loadDevMessages()
	loadErrorMessages()
}

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ApolloProvider client={apolloInternalClient}>
			<ApolloProvider client={apolloBrowserClient}>
				<main
					className={classNames(
						poppinsFont.variable,
						"font-sans h-full",
					)}
				>
					<Component {...pageProps} />
				</main>
			</ApolloProvider>
		</ApolloProvider>
	)
}
