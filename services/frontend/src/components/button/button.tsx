import { classNames } from "@/src/lib/class-names"
import Link from "next/link"
import { ButtonHTMLAttributes, ReactNode } from "react"

const baseStyle =
	"whitespace-nowrap cursor-pointer font-semibold transition-colors"

const buttonSizes = {
	xs: "text-xs px-4 py-1",
	sm: "text-sm px-4 py-2",
	md: "text-md px-4 py-3",
	lg: "text-lg px-4 py-4",
}

const buttonIntents = {
	primary: "bg-fuchsia-500 text-neutral-100 hover:bg-fuchsia-600",
	success: "bg-green-500 text-neutral-100 hover:bg-green-400",
	error: "bg-red-500 text-neutral-100 hover:bg-red-400",
}

const buttonStyles = {
	text: {
		primary: "text-fuchsia-400 hover:bg-fuchsia-600 hover:bg-opacity-20",
		success: "text-green-400 hover:bg-green-400 hover:bg-opacity-20",
		error: "text-red-400 hover:bg-red-400 hover:bg-opacity-20",
	},
	filled: {
		primary: "bg-fuchsia-500 text-neutral-100 hover:bg-fuchsia-600",
		success: "bg-green-500 text-neutral-100 hover:bg-green-400",
		error: "bg-red-500 text-neutral-100 hover:bg-red-400",
	},
}

interface ButtonPropsLink {
	children: ReactNode
	className?: string
	href?: string
	intent?: keyof (typeof buttonStyles)["filled" | "text"]
	size?: keyof typeof buttonSizes
	variant?: keyof typeof buttonStyles
	disabled?: boolean
	rounded?: boolean
	type?: ButtonHTMLAttributes<HTMLButtonElement>["type"]
	error?: boolean
	success?: boolean
}

interface ButtonPropsButton extends ButtonPropsLink {
	href?: never
}

export const Button = ({
	intent = "primary",
	variant = "filled",
	href,
	children,
	className,
	rounded = true,
	size = "md",
	error = false,
	disabled = false,
	type,
	success = false,
}: ButtonPropsLink | ButtonPropsButton) => {
	const appliedClassNames = classNames(
		baseStyle,
		rounded && "rounded-full",
		buttonStyles[variant][intent],
		buttonSizes[size],
		error && buttonIntents["error"],
		success && buttonIntents["success"],
		disabled && "opacity-50 cursor-not-allowed",
		className,
	)

	if (href) {
		return (
			<Link
				tabIndex={0}
				href={href}
				className={appliedClassNames}
			>
				{children}
			</Link>
		)
	}

	return (
		<button
			type={type}
			tabIndex={0}
			disabled={disabled}
			className={appliedClassNames}
		>
			{children}
		</button>
	)
}
