import { useUserSession } from "@/src/components/dashboard/hooks/use-user-session"
import { Button } from "@/src/components/button/button"
import { TopNavItem } from "@/src/components/dashboard/components/sidebar/top-nav-item"
import IconPark from "@/src/components/icons/tree"
import IconUserLarge from "@/src/components/icons/user-large"
import { signOut } from "next-auth/react"

export const Sidebar = () => {
	const userSession = useUserSession()

	return (
		<aside
			id="logo-sidebar"
			className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-space-100/10 bg-slate-950 pt-24 transition-transform sm:translate-x-0"
			aria-label="Sidebar"
		>
			<div className="h-full overflow-y-auto px-4 pb-4 pt-2">
				<ul className="flex h-full flex-col gap-2 font-medium">
					<TopNavItem
						link={"/dashboard"}
						icon={<IconUserLarge />}
					>
						Dashboard
					</TopNavItem>

					<TopNavItem
						link={"/dashboard/locations"}
						icon={<IconPark />}
					>
						Locations
					</TopNavItem>

					<Button
						intent={"danger"}
						size={"sm"}
						className={"mt-auto justify-center"}
						onClick={() => signOut({ callbackUrl: "/" })}
					>
						Sign out
					</Button>
				</ul>
			</div>
		</aside>
	)
}
