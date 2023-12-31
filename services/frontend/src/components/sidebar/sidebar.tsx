import { useBrowserSize } from "@/src/hooks/use-browser-size"
import { classNames } from "@/src/lib/class-names"
import {
	ForwardedRef,
	forwardRef,
	MouseEventHandler,
	ReactNode,
	useEffect,
	useRef,
} from "react"

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
		<div className="flex h-full flex-col overflow-x-hidden overflow-y-scroll rounded-t-lg bg-neutral-900 text-neutral-50 drop-shadow-md md:rounded-l-lg md:rounded-t-none">
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
	const interactionRef = useRef<HTMLDivElement>(null)

	const handleClick: MouseEventHandler = (event) => {
		if (!interactionRef.current?.contains(event.target as Node)) {
			onClose?.()
		}
	}

	return (
		<div
			onClick={handleClick}
			className={classNames(
				"fixed inset-0 z-10 overflow-y-auto overflow-x-hidden md:pointer-events-none",
				isShown ? "pointer-events-auto" : "pointer-events-none",
			)}
		>
			<section
				className="flex h-full max-w-full md:absolute md:inset-y-0 md:right-0"
				aria-labelledby="slide-over-heading"
			>
				<div
					ref={ref}
					className={classNames(
						`pointer-events-auto mt-[calc(100dvh-10rem)] md:mt-0 relative w-screen min-h-[calc(100dvh+1.5rem)] md:min-h-[100dvh] md:max-w-md transition-transform duration-500 ease-in-out`,
						isShown
							? "translate-y-0 md:translate-x-0 md:translate-y-0"
							: "translate-y-full md:translate-x-full md:translate-y-0",
					)}
				>
					<div
						ref={interactionRef}
						className={
							"flex h-full flex-col items-center justify-center gap-3"
						}
					>
						<div
							className={
								"h-1.5 w-14 rounded-full bg-neutral-50/50 md:hidden"
							}
						/>

						<div className={"h-full w-full"}>{children}</div>
					</div>
				</div>
			</section>
		</div>
	)
}

const SidebarForwarded = forwardRef(Sidebar)

export default SidebarForwarded
