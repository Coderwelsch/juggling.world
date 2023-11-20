import { UserMenu } from "@/src/components/dashboard/components/top-nav/top-nav-user-menu"
import { useUserSession } from "@/src/components/dashboard/hooks/use-user-session"
import { Headline } from "@/src/components/headline/headline"
import { LogoSmall } from "@/src/components/logo/logo-small"
import Link from "next/link"

export const TopNav = () => {
	const userSession = useUserSession()

	return (
		<nav className="fixed top-0 z-50 w-full border-b border-violet-100/10 bg-slate-950">
			<div className="p-3 lg:px-5 lg:pl-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center justify-start">
						<button
							data-drawer-target="logo-sidebar"
							data-drawer-toggle="logo-sidebar"
							aria-controls="logo-sidebar"
							type="button"
							className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 sm:hidden"
						>
							<span className="sr-only">Open sidebar</span>
							<svg
								className="h-6 w-6"
								aria-hidden="true"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									clipRule="evenodd"
									fillRule="evenodd"
									d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
								></path>
							</svg>
						</button>

						<Link
							href={"/dashboard"}
							className={"flex flex-row items-center gap-1"}
						>
							<LogoSmall className={"w-14"} />

							<div className="flex flex-col gap-0.5 text-2xl font-semibold text-violet-50">
								<Headline
									size={4}
									renderAs={"h1"}
									className={"font-semibold leading-5"}
								>
									juggling.world
								</Headline>

								<p className="text-xs font-medium text-violet-50/75">
									share · connect · learn
								</p>
							</div>
						</Link>
					</div>

					<div className="flex items-center">
						<div className="relative ml-3 flex items-center">
							<UserMenu />
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}
