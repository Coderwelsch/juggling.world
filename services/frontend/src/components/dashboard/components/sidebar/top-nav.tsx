import { Button } from "@/src/components/button/button"
import { useUserSession } from "@/src/components/dashboard/hooks/use-user-session"
import { Headline } from "@/src/components/headline/headline"
import IconUserLarge from "@/src/components/icons/user-large"
import { LogoSmall } from "@/src/components/logo/logo-small"
import { classNames } from "@/src/lib/class-names"
import { getStrapiUrl } from "@/src/lib/get-strapi-url"
import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useState } from "react"

const TopNavLink = ({
	children,
	href,
}: {
	href: string
	children: ReactNode
}) => {
	const router = useRouter()
	const basePath = router.pathname
	const pathName = href.startsWith(".") ? `${basePath}/${href}` : href

	return (
		<li>
			<Link
				href={pathName}
				className="block px-6 py-3 text-sm font-semibold text-gray-300 hover:bg-gray-100/10 hover:text-white"
				role="menuitem"
			>
				{children}
			</Link>
		</li>
	)
}

const AvatarMenu = ({ onClick }: { onClick: () => void }) => {
	const userSession = useUserSession()

	return (
		<div
			className={"flex cursor-pointer flex-row items-center gap-3.5"}
			onClick={onClick}
			// onBlur={() => setMenuOpened(false)}
		>
			<button
				type="button"
				className="flex rounded-full bg-gray-800 text-sm"
				aria-expanded="false"
				data-dropdown-toggle="dropdown-user"
			>
				<span className="sr-only">Open user menu</span>

				<div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-space-50/10">
					{userSession?.data?.avatar?.data?.attributes?.url ? (
						<Image
							className="h-full w-full"
							width={32}
							height={32}
							src={getStrapiUrl(
								userSession.data.avatar.data.attributes.url,
							)}
							alt="user photo"
						/>
					) : (
						<IconUserLarge
							className={"h-4/5 w-4/5 self-end fill-violet-500"}
						/>
					)}
				</div>
			</button>
		</div>
	)
}

const UserMenu = () => {
	const router = useRouter()
	const userSession = useUserSession()
	const [menuOpened, setMenuOpened] = useState(false)

	return (
		<>
			<AvatarMenu onClick={() => setMenuOpened(!menuOpened)} />

			<div
				className={classNames(
					"absolute right-0 top-full",
					menuOpened ? "flex" : "hidden",
					"z-50 my-4 list-none rounded-xl text-base flex-col" +
						" bg-space-950 border border-indigo-400/50",
				)}
			>
				<div
					className="rounded-t-xl bg-space-100/20 px-6 py-3.5"
					role="none"
				>
					{userSession?.data.username && (
						<Headline
							size={5}
							renderAs={"h4"}
							className={"text-indigo-100"}
						>
							{userSession?.data.username}
						</Headline>
					)}

					{userSession?.data.username && (
						<p className={"truncate text-sm text-indigo-100"}>
							your@email.here
						</p>
					)}
				</div>

				<hr className={"border-indigo-400/50"} />

				<ul className="flex flex-col gap-0 overflow-hidden rounded-b-xl bg-space-100/20 text-indigo-50">
					<TopNavLink href={"./settings/profile"}>Profile</TopNavLink>

					<hr className={"border-indigo-400/50"} />

					<Button
						rounded={false}
						intent={"danger"}
						variant={"text"}
						onClick={() => {
							signOut()
						}}
						size={"sm"}
					>
						Sign out
					</Button>
				</ul>
			</div>
		</>
	)
}

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
