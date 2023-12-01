import { classNames } from "@/src/lib/class-names"
import { ReactNode } from "react"

interface DividerHorizontalProps {
	className?: string
	children?: ReactNode
}

export const DividerHorizontal = ({
	className,
	children,
}: DividerHorizontalProps) => {
	return (
		<div className={"relative flex w-full items-center justify-center"}>
			<div
				className={classNames(
					"absolute left-0 top-1/2 h-px w-full bg-space-50/20",
					className,
				)}
			/>

			<p
				className={
					"relative z-10 bg-gray-800 px-2 text-center text-sm text-space-100/60"
				}
			>
				{children}
			</p>
		</div>
	)
}
