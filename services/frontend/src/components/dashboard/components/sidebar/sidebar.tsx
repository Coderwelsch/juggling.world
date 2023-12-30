import { Button } from "@/src/components/button/button"
import { TopNavItem } from "@/src/components/dashboard/components/top-nav/top-nav-item"
import IconBxHomeHeart from "@/src/components/icons/bx-home-heart"
import IconFireFill from "@/src/components/icons/fire-fill"
import IconTeamwork from "@/src/components/icons/teamwork"
import IconUserGroup from "@/src/components/icons/user-group"
import { useUserNeedsSetup } from "@/src/hooks/data/user/use-user-needs-setup"
import { signOut } from "next-auth/react"

export const Sidebar = () => {
	const userNeedsSetup = useUserNeedsSetup()
	const needsSetup = userNeedsSetup?.hasFinishedSetup === false

	return (
		<aside
			id="logo-sidebar"
			className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-neutral-100/10 bg-neutral-950 pt-24 transition-transform sm:translate-x-0"
			aria-label="Sidebar"
		>
			<div className="h-full overflow-y-auto px-4 pb-4 pt-2">
				<ul className="flex h-full flex-col gap-2 font-medium">
					<TopNavItem
						link={"/dashboard"}
						icon={<IconBxHomeHeart />}
					>
						Dashboard
					</TopNavItem>

					<TopNavItem
						link={"/dashboard/activities"}
						icon={<IconFireFill />}
						disabled={needsSetup}
					>
						Activities
					</TopNavItem>

					<TopNavItem
						link={"/dashboard/locations"}
						icon={<IconTeamwork />}
						disabled={needsSetup}
					>
						Groups
					</TopNavItem>

					<TopNavItem
						link={"/dashboard/locations"}
						icon={<IconUserGroup />}
						disabled={needsSetup}
					>
						Friends
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
