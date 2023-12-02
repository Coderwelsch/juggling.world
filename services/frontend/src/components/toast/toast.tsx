// react hot toast tailwind component in dark theme
import IconCircleFill from "@/src/components/icons/circle-fill"
import IconErrorWarningFill from "@/src/components/icons/error-warning-fill"
import IconTickCircle from "@/src/components/icons/tick-circle"
import { classNames } from "@/src/lib/class-names"
import toast, { Toaster } from "react-hot-toast"

const toastIntentStyles = {
	success: "bg-emerald-500",
	error: "bg-red-500 hover:bg-red-600",
	info: "bg-blue-500",
}

interface ToastProps {
	message: string
	intent: keyof typeof toastIntentStyles
}

const toastIcon = {
	success: IconTickCircle,
	error: IconErrorWarningFill,
	info: IconCircleFill,
}

const iconStyles: Record<keyof typeof toastIntentStyles, string> = {
	success: "fill-emerald-50",
	error: "fill-red-50",
	info: "fill-blue-50",
}

export const ToastProvider = () => {
	return (
		<Toaster
			position={"top-center"}
			containerClassName={"font-sans"}
		/>
	)
}

const Toast = ({ message, intent }: ToastProps) => {
	const Icon = toastIcon[intent]

	return (
		<div
			className={classNames(
				"flex flex-row items-center justify-center gap-1",
				"rounded-lg px-2 py-2 text-sm font-sans font-medium cursor-default",
				"shadow-md",
				"transition-colors duration-200 ease-in-out",
				toastIntentStyles[intent],
			)}
		>
			<Icon className={classNames("h-6 w-6", iconStyles[intent])} />
			<p className={"font-sans"}>{message}</p>
		</div>
	)
}

// custom toast
export const errorToast = ({ message }: { message: string }) => {
	return toast.custom(
		<Toast
			message={message}
			intent={"error"}
		/>,
		{
			duration: 5000,
		},
	)
}
