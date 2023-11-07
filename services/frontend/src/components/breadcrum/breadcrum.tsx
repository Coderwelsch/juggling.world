import { IconBxChevronRight } from "@/src/components/icons/bx-chevron-right"
import { classNames } from "@/src/lib/class-names"
import { Children, ReactNode } from "react"

interface BreadcrumProps {
	children: ReactNode
	seperator?: ReactNode
}

interface BreadcrumItemProps {
	children: ReactNode
	active?: boolean
}

const BreadcrumItem = ({ children, active }: BreadcrumItemProps) => {
	return (
		<label
			className={classNames(
				active ? "text-violet-500" : "text-space-50/80",
			)}
		>
			{children}
		</label>
	)
}

export const Breadcrum = ({ children, seperator }: BreadcrumProps) => {
	// add a circle between each item
	const childrenWithSeparators = Children.map(children, (child, i) => {
		return (
			<>
				{child}
				{i !== children?.length - 1 &&
					(seperator || (
						<IconBxChevronRight className={"fill-space-100"} />
					))}
			</>
		)
	})

	return (
		<nav className="flex w-full flex-row items-center justify-center gap-2 text-sm font-medium">
			{childrenWithSeparators}
		</nav>
	)
}

Breadcrum.Item = BreadcrumItem
