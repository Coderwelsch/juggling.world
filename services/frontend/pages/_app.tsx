import "@/styles/globals.css"
import { QueryClientProvider } from "@/src/lib/clients/tanstack-query"
import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider>
			<Component {...pageProps} />
		</QueryClientProvider>
	)
}
