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

			<div className="bg-slate-950 p-4 sm:ml-64">
				<div className="mx-auto mt-24 w-full max-w-4xl">{children}</div>
			</div>
		</>
	)
}
