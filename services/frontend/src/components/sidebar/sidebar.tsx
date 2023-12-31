import { classNames } from "@/src/lib/class-names"
import { ForwardedRef, forwardRef, ReactNode } from "react"

interface SidebarProps {
	isShown: boolean
	children: ReactNode
	onClose?: () => void
}

export const Body = ({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) => {
	return (
		<div className="flex h-full flex-col overflow-y-scroll rounded-l-lg bg-slate-900 text-slate-50 shadow-xl">
			<div className={classNames("relative flex-1 px-4 py-6", className)}>
				{children}
			</div>
		</div>
	)
}

const Sidebar = (
	{ isShown, onClose, children }: SidebarProps,
	ref: ForwardedRef<HTMLDivElement>,
) => {
	return (
		<div
			className={classNames(
				"pointer-events-none fixed inset-0 z-10 overflow-hidden",
			)}
		>
			<div className="absolute inset-0 overflow-hidden">
				<section
					className="absolute inset-y-0 right-0 flex max-w-full pl-10"
					aria-labelledby="slide-over-heading"
				>
					<div
						ref={ref}
						className={classNames(
							"pointer-events-auto relative w-screen max-w-md transition-transform duration-500 ease-in-out",
							isShown ? "translate-x-0" : "translate-x-full",
						)}
					>
						{children}
					</div>
				</section>
			</div>
		</div>
	)
}

const SidebarForwarded = forwardRef(Sidebar)

export default SidebarForwarded
