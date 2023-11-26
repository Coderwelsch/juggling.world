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

			<div className="relative ml-64 mt-20 min-h-screen bg-slate-950 p-8">
				<div className="mx-auto w-full max-w-4xl">{children}</div>
			</div>
		</>
	)
}
