import { Avatar } from "@/src/components/avatar/avatar"
import { classNames } from "@/src/lib/class-names"
import { ReactNode } from "react"

interface AvatarTagProps {
	children: ReactNode
	url?: string
	className?: string
}

export const AvatarTag = ({ url, children, className }: AvatarTagProps) => {
	return (
		<div
			className={classNames(
				"flex flex-row items-center gap-1",
				className,
			)}
		>
			<Avatar
				src={url}
				className={"h-4 w-4"}
			/>

			{children}
		</div>
	)
}
