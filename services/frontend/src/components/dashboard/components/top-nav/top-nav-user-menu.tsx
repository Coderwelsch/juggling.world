import { Button } from "@/src/components/button/button"
import { Headline } from "@/src/components/headline/headline"
import IconUserLarge from "@/src/components/icons/user-large"
import { useUserContext } from "@/src/contexts/user-context"
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
				className="block px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-100/10 hover:text-white"
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
				className="flex rounded-full bg-slate-800 text-sm"
				aria-expanded="false"
				data-dropdown-toggle="dropdown-user"
				onClick={onClick}
				tabIndex={0}
			>
				<span className="sr-only">Open user menu</span>

				<div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-50/10">
					{user?.avatar?.url ? (
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
							" bg-slate-800 border border-indigo-400/50",
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
								className={"text-slate-100"}
							>
								{user.username}
							</Headline>
						)}

						{user?.email && (
							<p className={"truncate text-sm text-slate-100"}>
								{user.email}
							</p>
						)}
					</div>

					<hr className={"border-indigo-400/50"} />

					<ul className="flex flex-col gap-0 overflow-hidden rounded-b-xl text-slate-50">
						<UserMenuLink href={"./settings/profile"}>
							Profile
						</UserMenuLink>

						<hr className={"border-slate-100/20"} />

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
			</div>
		</>
	)
}
