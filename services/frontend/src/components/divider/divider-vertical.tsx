import { classNames } from "@/src/lib/class-names"

interface DividerVerticalProps {
	className?: string
}

export const DividerVertical = ({ className }: DividerVerticalProps) => {
	return (
		<div
			className={classNames(
				"h-full border-r border-primary-950 opacity-10",
				className,
			)}
		/>
	)
}
