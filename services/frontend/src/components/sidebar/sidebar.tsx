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
		<div className="flex h-full flex-col overflow-x-hidden overflow-y-scroll rounded-t-lg bg-neutral-900 text-neutral-50 shadow-xl md:rounded-l-lg md:rounded-t-none">
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
			<div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
				<section
					className="flex max-w-full md:absolute md:inset-y-0 md:right-0"
					aria-labelledby="slide-over-heading"
				>
					<div
						ref={ref}
						className={classNames(
							`pointer-events-auto mt-[80vh] md:mt-0 relative w-screen md:max-w-md min-h-[100vh] md:min-h-full transition-transform duration-500 ease-in-out`,
							isShown
								? "translate-y-0 md:translate-x-0 md:translate-y-0"
								: "translate-y-full md:translate-x-full md:translate-y-0",
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
