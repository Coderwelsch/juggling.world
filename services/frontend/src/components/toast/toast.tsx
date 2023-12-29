// react hot toast tailwind component in dark theme
import { Headline } from "@/src/components/headline/headline"
import IconCircleFill from "@/src/components/icons/circle-fill"
import IconCloseCircle from "@/src/components/icons/close-circle"
import IconErrorWarningFill from "@/src/components/icons/error-warning-fill"
import IconTickCircle from "@/src/components/icons/tick-circle"
import { classNames } from "@/src/lib/class-names"
import toast, { Toaster } from "react-hot-toast"

const toastIntentStyles = {
	success: "bg-emerald-500",
	error: "bg-red-500 hover:bg-red-600",
	info: "bg-blue-500",
}

const iconStyles: Record<keyof typeof toastIntentStyles, string> = {
	success: "fill-emerald-50",
	error: "fill-red-50",
	info: "fill-blue-50",
}

const closeIconStyles: Record<keyof typeof toastIntentStyles, string> = {
	success: "fill-emerald-100 hover:fill-emerald-50",
	error: "fill-red-100 hover:fill-red-50",
	info: "fill-blue-100 hover:fill-blue-50",
}

interface ToastProps {
	title?: string
	message: string
	intent: keyof typeof toastIntentStyles
	isVisible?: boolean
	onClose?: () => void
}

const toastIcon = {
	success: IconTickCircle,
	error: IconErrorWarningFill,
	info: IconCircleFill,
}

export const ToastProvider = () => {
	return (
		<Toaster
			position={"top-center"}
			containerClassName={"font-sans"}
		/>
	)
}

const Toast = ({ title, message, intent, onClose, isVisible }: ToastProps) => {
	const Icon = toastIcon[intent]

	return (
		<div
			className={classNames(
				"relative flex flex-row items-start justify-center gap-3",
				"rounded-xl px-3 py-3 text-sm font-sans font-medium cursor-default",
				"shadow-xl",
				"transition-all duration-200 ease-in-out transform",
				isVisible ? "opacity-100" : "opacity-0 scale-95",
				toastIntentStyles[intent],
			)}
		>
			<div className={"flex flex-row gap-1.5"}>
				<Icon
					className={classNames(
						"h-5 w-5 grow-0 mt-0.5",
						iconStyles[intent],
					)}
				/>

				<div className={"flex flex-col gap-0"}>
					{title && <Headline size={6}>{title}</Headline>}
					<p className={"font-sans text-xs opacity-80"}>{message}</p>
				</div>
			</div>

			{onClose && (
				<IconCloseCircle
					className={classNames(
						"h-4 w-4 grow-0 cursor-pointer mt-1",
						closeIconStyles[intent],
					)}
					onClick={onClose}
				/>
			)}
		</div>
	)
}

export const errorToast = ({
	title,
	message,
}: {
	title?: string
	message: string
}) => {
	return toast.custom(
		(t) => (
			<Toast
				title={title}
				message={message}
				intent={"error"}
				isVisible={t.visible}
				onClose={() => toast.dismiss(t.id)}
			/>
		),
		{
			duration: 10000,
		},
	)
}
