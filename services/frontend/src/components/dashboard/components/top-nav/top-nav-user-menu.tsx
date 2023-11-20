import { Button } from "@/src/components/button/button"
import { useUserSession } from "@/src/components/dashboard/hooks/use-user-session"
import { Headline } from "@/src/components/headline/headline"
import IconUserLarge from "@/src/components/icons/user-large"
import { classNames } from "@/src/lib/class-names"
import { getStrapiUrl } from "@/src/lib/get-strapi-url"
import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useState } from "react"

const UserMenuLink = ({
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

const AvatarMenu = ({
	onOpen,
	onClose,
}: {
	onOpen: () => void
	onClose: () => void
}) => {
	const userSession = useUserSession()

	return (
		<div className={"flex cursor-pointer flex-row items-center gap-3.5"}>
			<button
				type="button"
				className="flex rounded-full bg-gray-800 text-sm"
				aria-expanded="false"
				data-dropdown-toggle="dropdown-user"
				onClick={onOpen}
				onFocus={onOpen}
				onBlur={onClose}
				tabIndex={0}
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
							className={"h-4/5 w-4/5 self-end fill-violet-400"}
						/>
					)}
				</div>
			</button>
		</div>
	)
}

export const UserMenu = () => {
	const router = useRouter()
	const userSession = useUserSession()
	const [menuOpened, setMenuOpened] = useState(false)

	return (
		<>
			<AvatarMenu
				onOpen={() => setMenuOpened(true)}
				onClose={() => setMenuOpened(false)}
			/>

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
					<UserMenuLink href={"./settings/profile"}>
						Profile
					</UserMenuLink>

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
