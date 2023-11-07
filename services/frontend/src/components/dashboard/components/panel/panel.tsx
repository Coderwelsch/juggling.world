import { classNames } from "@/src/lib/class-names"

interface PanelProps {
	children: React.ReactNode
	className?: string
}

export const Panel = ({ children, className }: PanelProps) => {
	return (
		<section
			className={classNames(
				"flex flex-col gap-6 rounded-xl border border-space-50/10 bg-space-100/20 px-10 py-8",
				className,
			)}
		>
			{children}
		</section>
	)
}
