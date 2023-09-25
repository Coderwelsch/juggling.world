import {
	QueryClient,
	QueryClientProvider as Provider,
} from "@tanstack/react-query"
import { ReactNode } from "react"

const queryClient = new QueryClient()

interface QueryClientProviderProps {
	children: ReactNode
}

export const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
	return <Provider client={queryClient}>{children}</Provider>
}
