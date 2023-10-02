import LOGO from "@/src/assets/logo/minimal.svg"
import { classNames } from "@/src/lib/class-names"

interface LogoSmallProps {
	className?: string
}

export const LogoSmall = ({ className }: LogoSmallProps) => {
	return (
		<img
			className={classNames("w-20", className)}
			src={LOGO.src}
			alt=""
		/>
	)
}
