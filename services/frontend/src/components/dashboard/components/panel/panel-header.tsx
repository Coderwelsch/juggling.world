import { Headline } from "@/src/components/headline/headline"
import { JSXElementConstructor, SVGProps } from "react"

export const PanelHeader = ({
	children,
	Icon,
	className,
}: {
	className?: string
	children: React.ReactNode
	Icon: JSXElementConstructor<SVGProps<SVGSVGElement>>
}) => {
	return (
		<div className={"flex flex-row items-center gap-7"}>
			<div
				className={
					"flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary-600"
				}
			>
				<Icon className={"h-3/5 w-3/5 fill-neutral-50"} />
			</div>

			<Headline
				size={1}
				className={className}
			>
				{children}
			</Headline>
		</div>
	)
}
