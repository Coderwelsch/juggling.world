import "@/styles/globals.css"
import { classNames } from "@/src/lib/class-names"
import { QueryClientProvider } from "@/src/lib/clients/tanstack-query"
import { poppinsFont } from "@/src/lib/fonts"
import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider>
			<main className={classNames(poppinsFont.variable, "font-sans")}>
				<Component {...pageProps} />
			</main>
		</QueryClientProvider>
	)
}
