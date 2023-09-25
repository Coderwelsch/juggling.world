import { classNames } from "@/src/lib/class-names"
import { ButtonHTMLAttributes, ReactNode } from "react"

const baseStyle = "px-4 py-3 font-semibold transition-colors"

const buttonIntents = {
	primary: "bg-fuchsia-500 text-neutral-100 hover:bg-fuchsia-400",
	secondary: "bg-space-400 text-neutral-100 hover:bg-space-300",
	tertiary: "bg-space-300 text-neutral-100 hover:bg-space-200",
}

interface ButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
	children: ReactNode
	intent?: keyof typeof buttonIntents
	rounded?: boolean
}

export const Button = ({
	intent = "primary",
	children,
	rounded = true,
	...props
}: ButtonProps) => {
	const buttonIntent = buttonIntents[intent]

	return (
		<button
			className={classNames(
				baseStyle,
				buttonIntent,
				rounded && "rounded-lg",
			)}
			{...props}
		>
			{children}
		</button>
	)
}
