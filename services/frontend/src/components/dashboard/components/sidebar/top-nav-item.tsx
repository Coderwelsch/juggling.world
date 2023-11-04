import { Button } from "@/src/components/button/button"
import { useRouter } from "next/router"
import { ReactNode } from "react"

interface NavItemProps {
	children: ReactNode
	link: string
	icon: ReactNode
}

export const TopNavItem = ({ children, link, icon }: NavItemProps) => {
	const router = useRouter()

	const isActive = router.pathname === link

	return (
		<li>
			<Button
				className={"w-full justify-start"}
				href={link}
				intent={isActive ? "primary" : "neutral"}
				variant={isActive ? "filled" : "text"}
				active={isActive}
				size={"sm"}
				IconBefore={icon}
			>
				{children}
			</Button>
		</li>
	)
}
