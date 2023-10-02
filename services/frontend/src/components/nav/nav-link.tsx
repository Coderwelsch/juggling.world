import { classNames } from "@/src/lib/class-names"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode } from "react"

interface NavLinkProps {
	href: string
	children: ReactNode
	className?: string
	activeClassName?: string
}

export const NavLink = ({
	href,
	children,
	className,
	activeClassName,
}: NavLinkProps) => {
	const router = useRouter()

	const isActive = router.pathname.startsWith(href)

	return (
		<Link
			href={href}
			className={classNames(className, isActive && activeClassName)}
		>
			{children}
		</Link>
	)
}
