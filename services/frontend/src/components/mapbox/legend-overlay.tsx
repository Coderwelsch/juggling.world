import { classNames } from "@/src/lib/class-names"
import { ReactNode } from "react"

interface LegendOverlayProps {
	children: ReactNode
	className?: string
	style?: React.CSSProperties
}

type Intent = "primary" | "secondary" | "green"

const legendIntentStyles: Record<Intent, string> = {
	primary: "bg-primary-500 border border-primary-300",
	secondary: "bg-blue-500 border border-blue-300",
	green: "bg-emerald-500 border border-emerald-300",
}

const LegendOverlayItem = ({
	children,
	className,
	style,
	intent,
}: LegendOverlayProps & { intent: keyof typeof legendIntentStyles }) => {
	return (
		<div
			className={classNames(
				"flex flex-row gap-1 items-center justify-center",
				className,
			)}
			style={style}
		>
			<div
				className={classNames(
					"h-4 w-4 rounded-full",
					legendIntentStyles[intent],
				)}
			/>

			<p className={"text-sm"}>{children}</p>
		</div>
	)
}

export const LegendOverlay = ({
	children,
	className,
	style,
}: LegendOverlayProps) => {
	return (
		<div
			className={classNames(
				"absolute bottom-0 left-1/2 flex flex-row items-center justify-center transform -translate-x-1/2",
				className,
			)}
			style={style}
		>
			<div
				className={
					"flex flex-row items-center justify-center gap-4 rounded-t-lg bg-neutral-800 px-3 py-1"
				}
			>
				{children}
			</div>
		</div>
	)
}

LegendOverlay.Item = LegendOverlayItem
