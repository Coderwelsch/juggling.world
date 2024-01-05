import { Button } from "@/src/components/button/button"
import { Headline } from "@/src/components/headline/headline"
import IconUserLarge from "@/src/components/icons/user-large"
import IconSuperman from "@/src/components/icons/vibrant/superman"
import { useUserProfileContext } from "@/src/hooks/data/user/use-profile-data"
import { classNames } from "@/src/lib/class-names"
import { getStrapiUrl } from "@/src/lib/get-strapi-url"
import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useRef, useState } from "react"

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
				className="block px-6 py-3 text-sm font-semibold text-neutral-300 hover:bg-neutral-100/10 hover:text-neutral-50"
				role="menuitem"
			>
				{children}
			</Link>
		</li>
	)
}

interface AvatarMenuProps {
	onClick: () => void
	opened: boolean
}

const AvatarMenu = ({ onClick, opened }: AvatarMenuProps) => {
	const user = useUserProfileContext()

	return (
		<div className={"flex cursor-pointer flex-row items-center gap-3.5"}>
			<button
				type="button"
				className="flex rounded-full bg-neutral-800 text-sm"
				aria-expanded="false"
				data-dropdown-toggle="dropdown-user"
				onClick={onClick}
				tabIndex={0}
			>
				<span className="sr-only">Open user menu</span>

				<div
					className={classNames(
						"flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-neutral-50/10",
						user?.isAdmin && "border-2 border-primary-400",
					)}
				>
					{user?.isAdmin ? (
						<IconSuperman className={"h-4/5 w-4/5"} />
					) : user?.avatar?.url ? (
						<Image
							className="h-full w-full"
							width={32}
							height={32}
							src={getStrapiUrl(user.avatar.url)}
							alt="user photo"
						/>
					) : (
						<IconUserLarge
							className={"h-4/5 w-4/5 self-end fill-primary-400"}
						/>
					)}
				</div>
			</button>
		</div>
	)
}

export const UserMenu = () => {
	const user = useUserProfileContext()
	const [menuOpened, setMenuOpened] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	const handleClickOutside = (event: MouseEvent) => {
		if (ref.current && !ref.current.contains(event.target as Node)) {
			setMenuOpened(false)
		}
	}

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside)

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [])

	return (
		<>
			<div ref={ref}>
				<AvatarMenu
					opened={menuOpened}
					onClick={() => setMenuOpened(!menuOpened)}
				/>

				<div
					className={classNames(
						"absolute right-0 top-full",
						menuOpened ? "flex" : "hidden",
						"z-50 my-4 list-none rounded-xl text-base flex-col" +
							" bg-densed-900 border border-densed-100/20",
					)}
				>
					<div
						className="rounded-t-xl px-6 py-3.5"
						role="none"
					>
						{user?.username && (
							<Headline
								size={5}
								renderAs={"h4"}
								className={
									"flex flex-row items-center gap-2 text-neutral-100"
								}
							>
								{user.username}

								{user?.isAdmin && (
									<span
										className={
											"truncate text-xs text-primary-400"
										}
									>
										(admin)
									</span>
								)}
							</Headline>
						)}

						{user?.email && (
							<p className={"truncate text-sm text-neutral-100"}>
								{user.email}
							</p>
						)}
					</div>

					<hr className={"border-densed-100/20"} />

					<ul className="flex flex-col gap-0 overflow-hidden rounded-b-xl text-neutral-50">
						<UserMenuLink href={"./settings/profile"}>
							Profile
						</UserMenuLink>

						<hr className={"border-neutral-100/20"} />

						<Button
							rounded={false}
							intent={"coral"}
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
			</div>
		</>
	)
}
