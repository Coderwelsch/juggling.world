import { Headline } from "@/src/components/headline/headline"
import { JSXElementConstructor, SVGProps } from "react"

export const PanelHeader = ({
	children,
	Icon,
}: {
	children: React.ReactNode
	Icon: JSXElementConstructor<SVGProps<SVGSVGElement>>
}) => {
	return (
		<div className={"flex flex-row items-center gap-7"}>
			<div
				className={
					"flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-slate-50/20 bg-primary-600"
				}
			>
				<Icon className={"h-3/5 w-3/5 fill-slate-50"} />
			</div>

			<Headline size={1}>{children}</Headline>
		</div>
	)
}
