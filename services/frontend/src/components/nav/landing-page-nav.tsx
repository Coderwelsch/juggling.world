import { Button } from "@/src/components/button/button"
import { DividerVertical } from "@/src/components/divider/divider-vertical"
import { Headline } from "@/src/components/headline/headline"
import { LogoSmall } from "@/src/components/logo/logo-small"
import { NavLink } from "@/src/components/nav/nav-link"
import { classNames } from "@/src/lib/class-names"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { ReactNode } from "react"

interface NavItemProps {
	children: ReactNode
	href: string
}

const NavItem = ({ children, href }: NavItemProps) => {
	return (
		<NavLink
			href={href}
			className={"font-semibold text-primary-950 hover:text-primary-500"}
			activeClassName={"text-primary-500"}
		>
			{children}
		</NavLink>
	)
}

export const LandingPageNav = ({ visible = true }: { visible?: boolean }) => {
	const session = useSession()

	return (
		<nav
			className={classNames(
				"fixed top-4 z-50 w-full px-4 transition transform",
				!visible && "opacity-0 pointer-events-none -translate-y-1/4",
			)}
		>
			<div className="mx-auto flex w-full max-w-5xl flex-row justify-between rounded-full bg-primary-50 px-3.5 shadow">
				<Link
					href={"/"}
					className={"flex flex-row items-center gap-1"}
				>
					<LogoSmall className={"w-14"} />

					<div className="flex flex-col text-2xl font-semibold text-primary-950">
						<Headline
							size={4}
							renderAs={"h1"}
							className={"font-semibold leading-5"}
						>
							juggling.world
						</Headline>

						<p className="text-xs font-medium text-primary-950">
							share · connect · learn
						</p>
					</div>
				</Link>

				<div className="flex items-center justify-end gap-4 py-3 md:gap-8">
					<div
						className={classNames("md:flex flex-row hidden gap-6")}
					>
						<NavItem href={"/"}>home</NavItem>
						<NavItem href={"/tutorials"}>tutorials</NavItem>
						<NavItem href={"/shops"}>shops</NavItem>
						<NavItem href={"/about"}>about</NavItem>
					</div>

					<DividerVertical className={"hidden md:block"} />

					{session.status === "authenticated" ? (
						<Button
							size={"sm"}
							href={"/dashboard"}
						>
							Dashboard
						</Button>
					) : (
						<Button
							size={"sm"}
							href={"/signin"}
						>
							login / register
						</Button>
					)}
				</div>
			</div>
		</nav>
	)
}
