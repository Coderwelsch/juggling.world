import { Button } from "@/src/components/button/button"
import { DividerVertical } from "@/src/components/divider/divider-vertical"
import { Headline } from "@/src/components/headline/headline"
import { LogoSmall } from "@/src/components/logo/logo-small"
import { NavLink } from "@/src/components/nav/nav-link"
import { classNames } from "@/src/lib/class-names"
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
			className={"font-semibold text-indigo-950 hover:text-fuchsia-500"}
			activeClassName={"text-fuchsia-500"}
		>
			{children}
		</NavLink>
	)
}

export const LandingPageNav = ({ visible = true }: { visible?: boolean }) => {
	return (
		<nav
			className={classNames(
				"fixed top-4 z-50 w-full px-4 transition transform",
				!visible && "opacity-0 pointer-events-none -translate-y-1/4",
			)}
		>
			<div className="mx-auto flex w-full max-w-5xl flex-row justify-between rounded-full bg-purple-100 px-3.5 shadow">
				<Link
					href={"/"}
					className={"flex flex-row items-center gap-1"}
				>
					<LogoSmall className={"w-14"} />

					<div className="flex flex-col text-2xl font-semibold text-indigo-950">
						<Headline
							size={4}
							renderAs={"h1"}
							className={"font-semibold leading-5"}
						>
							diabolo.world
						</Headline>

						<p className="text-xs font-medium text-indigo-950">
							share · connect · learn
						</p>
					</div>
				</Link>

				<div className="flex items-center justify-end gap-4 py-3 md:gap-8">
					<div className={"flex flex-row gap-3 sm:gap-4 md:gap-6 "}>
						<NavItem href={"/"}>home</NavItem>
						<NavItem href={"/tutorials"}>tutorials</NavItem>
						<NavItem href={"/shops"}>shops</NavItem>
						<NavItem href={"/about"}>about</NavItem>
					</div>

					<DividerVertical />

					<Button
						size={"sm"}
						href={"/register"}
					>
						login / register
					</Button>
				</div>
			</div>
		</nav>
	)
}
