import { PanelBody } from "@/src/components/dashboard/components/panel/panel-body"
import { PanelFooter } from "@/src/components/dashboard/components/panel/panel-footer"
import { PanelHeader } from "@/src/components/dashboard/components/panel/panel-header"
import { classNames } from "@/src/lib/class-names"

interface PanelProps {
	children: React.ReactNode
	className?: string
}

export const Panel = ({ children, className }: PanelProps) => {
	return (
		<section
			className={classNames(
				"flex flex-col rounded-xl border border-neutral-50/10 bg-neutral-800 px-8 py-6 pb-8",
				className,
			)}
		>
			{children}
		</section>
	)
}

Panel.Header = PanelHeader
Panel.Body = PanelBody
Panel.Footer = PanelFooter
