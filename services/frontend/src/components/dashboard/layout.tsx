import { Sidebar } from "@/src/components/dashboard/components/sidebar/sidebar"
import { TopNav } from "@/src/components/dashboard/components/top-nav/top-nav"
import { ReactNode } from "react"

interface DashboardLayoutProps {
	children: ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
	return (
		<>
			<TopNav />

			<Sidebar />

			<div className="relative ml-64 mt-20 min-h-screen p-8">
				<div className="mx-auto flex w-full max-w-3xl flex-col gap-16">
					{children}
				</div>
			</div>
		</>
	)
}
