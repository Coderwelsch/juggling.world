import { Button } from "@/src/components/button/button"
import { Headline } from "@/src/components/headline/headline"
import { classNames } from "@/src/lib/class-names"
import { ReactNode } from "react"
import * as React from "react"

interface MapOverlayProps {
	children: ReactNode
}

const MapOverlayHeadline = ({ children }: { children: ReactNode }) => {
	return (
		<Headline
			size={1}
			renderAs={"h2"}
			className={"relative z-10"}
		>
			{children}
		</Headline>
	)
}

const MapOverlayDescription = ({ children }: { children: ReactNode }) => {
	return <p className={"text-lg font-medium text-primary-200"}>{children}</p>
}
const MapOverlayButton = ({
	children,
	href,
	className,
}: {
	children: ReactNode
	href?: string
	className?: string
}) => {
	return (
		<Button
			intent={"primary"}
			variant={"filled"}
			size={"sm"}
			href={href}
			className={classNames("pointer-events-auto", className)}
		>
			{children}
		</Button>
	)
}

const MapOverlaySecondaryButton = ({
	children,
	href,
	className,
}: {
	children: ReactNode
	href?: string
	className?: string
}) => {
	return (
		<Button
			intent={"primary"}
			variant={"text"}
			size={"sm"}
			href={href}
			className={classNames("pointer-events-auto", className)}
		>
			{children}
		</Button>
	)
}

const MapOverlayButtonGroup = ({ children }: { children: ReactNode }) => {
	return (
		<div className={"flex flex-row justify-center gap-2"}>{children}</div>
	)
}

export const MapOverlay = ({ children }: MapOverlayProps) => {
	return (
		<div
			className={classNames(
				"absolute bottom-0 left-0 flex min-h-[60vh] w-full flex-col items-center justify-end p-6 pointer-events-none",
				"bg-gradient-to-t from-blue-950 to-transparent",
			)}
		>
			<div
				className={
					"flex max-w-md flex-col gap-4 text-center text-primary-50"
				}
			>
				{children}
			</div>
		</div>
	)
}

MapOverlay.Headline = MapOverlayHeadline
MapOverlay.Description = MapOverlayDescription
MapOverlay.ButtonGroup = MapOverlayButtonGroup
MapOverlay.Button = MapOverlayButton
MapOverlay.SecondaryButton = MapOverlaySecondaryButton
