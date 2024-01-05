import { LoadingWheel } from "@/src/components/loading-wheel"
import { classNames } from "@/src/lib/class-names"
import Link from "next/link"
import { ButtonHTMLAttributes, ReactNode } from "react"

const baseStyle = classNames(
	"relative whitespace-nowrap cursor-pointer font-semibold transition-colors inline-flex flex-row items-center justify-center gap-2",
	//"border border-transparent hover:border-neutral-50/20",
)

const buttonSizes = {
	xs: "text-xs px-2 py-1 gap-0.5",
	sm: "text-sm px-3 py-1.5 gap-1.5",
	md: "text-md px-6 py-3 gap-1",
	lg: "text-lg px-8 py-4 gap-2",
}

const iconSizes = {
	xs: "h-3 w-3",
	sm: "h-4 w-4",
	md: "h-5 w-5 -mr-2.5",
	lg: "h-6 w-6 -mr-3",
}

const buttonStyles: Record<string, Record<Intent, string>> = {
	text: {
		primary: "text-primary-400 hover:bg-primary-600/20",
		neutral: "text-neutral-50 hover:bg-neutral-200/10",
		mint: "text-green-400 hover:bg-green-400/20",
		coral: "text-coral-400 hover:bg-coral-400/20",
		densed: "text-densed-200 hover:bg-densed-100/10",
		sun: "text-sun-500 hover:bg-sun-400/20",
	},
	filled: {
		primary: "bg-primary-500 text-neutral-100 hover:bg-primary-600",
		neutral: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
		mint: "bg-green-500 text-neutral-100 hover:bg-green-400",
		coral: "bg-coral-500 text-coral-50 hover:bg-coral-400",
		densed: "bg-densed-700 text-densed-100 hover:bg-densed-50",
		sun: "bg-sun-500 text-neutral-800 hover:bg-sun-400",
	},
}

interface ButtonPropsLink {
	children: ReactNode
	className?: string
	onClick?: () => void
	active?: boolean
	tabIndex?: number
	href?: string
	intent?: keyof (typeof buttonStyles)["filled" | "text"]
	size?: keyof typeof buttonSizes
	variant?: keyof typeof buttonStyles
	disabled?: boolean
	rounded?: boolean
	loading?: boolean
	type?: ButtonHTMLAttributes<HTMLButtonElement>["type"]
	error?: boolean
	success?: boolean
	IconBefore?: ReactNode
	IconAfter?: ReactNode
}

interface ButtonPropsButton extends ButtonPropsLink {
	href?: never
}

export const Button = ({
	tabIndex = 0,
	intent = "primary",
	variant = "filled",
	href,
	active = false,
	children,
	className,
	IconBefore,
	IconAfter,
	rounded = true,
	size = "sm",
	error = false,
	disabled = false,
	loading = false,
	type,
	success = false,
	...props
}: ButtonPropsLink | ButtonPropsButton) => {
	const appliedClassNames = classNames(
		baseStyle,
		rounded && "rounded-full",
		buttonStyles[variant][intent],
		buttonSizes[size],
		loading && "text-transparent",
		error && buttonStyles[variant]["coral"],
		loading && "text-transparent",
		success && buttonStyles[variant]["mint"],
		disabled && "opacity-50 cursor-not-allowed",
		className,
	)

	if (href) {
		return (
			<Link
				tabIndex={0}
				href={href}
				className={appliedClassNames}
				{...props}
			>
				{IconBefore && (
					<span className={iconSizes[size]}>{IconBefore}</span>
				)}

				{children}

				{IconAfter && (
					<span className={iconSizes[size]}>{IconAfter}</span>
				)}

				{loading && (
					<LoadingWheel
						className={classNames(
							"absolute left-1/2 top-1/2",
							iconSizes[size],
						)}
					/>
				)}
			</Link>
		)
	}

	return (
		<button
			type={type}
			tabIndex={0}
			disabled={disabled}
			className={appliedClassNames}
			{...props}
		>
			{IconBefore && (
				<span className={iconSizes[size]}>{IconBefore}</span>
			)}

			{children}

			{IconAfter && <span className={iconSizes[size]}>{IconAfter}</span>}

			{loading && (
				<LoadingWheel
					className={classNames(
						"absolute left-1/2 top-1/2 h-6 w-6",
						iconSizes[size],
					)}
				/>
			)}
		</button>
	)
}
