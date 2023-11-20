import { IconBxChevronRight } from "@/src/components/icons/bx-chevron-right"
import { classNames } from "@/src/lib/class-names"
import { Children, ReactNode } from "react"

interface BreadcrumProps {
	children: ReactNode
	seperator?: ReactNode
}

interface BreadcrumItemProps extends React.HTMLAttributes<HTMLLabelElement> {
	children: ReactNode
	active?: boolean
	IconBefore?: ReactNode
}

const BreadcrumItem = ({
	children,
	active,
	IconBefore,
	...props
}: BreadcrumItemProps) => {
	return (
		<label
			className={classNames(
				"flex flex-row gap-1.5 items-center justify-center",
				active
					? "text-violet-500 fill-violet-500"
					: "text-space-50/80 fill-white-50/80",
			)}
			{...props}
		>
			{IconBefore && (
				<span className={classNames("h-3 w-3")}>{IconBefore}</span>
			)}

			{children}
		</label>
	)
}

export const Breadcrum = ({ children, seperator }: BreadcrumProps) => {
	const childrenLength = Children.count(children) - 1

	// add a circle between each item
	const childrenWithSeparators = Children.map(children, (child, i) => {
		return (
			<>
				{child}
				{i !== childrenLength &&
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
