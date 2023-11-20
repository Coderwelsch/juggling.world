import { Button } from "@/src/components/button/button"
import { useRouter } from "next/router"
import { ReactNode } from "react"

interface NavItemProps {
	children: ReactNode
	link: string
	icon: ReactNode
	disabled?: boolean
}

export const TopNavItem = ({
	children,
	link,
	icon,
	disabled,
}: NavItemProps) => {
	const router = useRouter()

	const isActive = router.pathname === link

	return (
		<li>
			<Button
				className={"w-full justify-start"}
				href={disabled ? undefined : link}
				intent={isActive ? "primary" : "neutral"}
				variant={isActive ? "filled" : "text"}
				disabled={disabled}
				active={isActive}
				size={"sm"}
				IconBefore={icon}
			>
				{children}
			</Button>
		</li>
	)
}
