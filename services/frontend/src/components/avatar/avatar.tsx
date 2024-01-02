import IconUserLarge from "@/src/components/icons/user-large"
import { classNames } from "@/src/lib/class-names"
import { getStrapiUrl } from "@/src/lib/get-strapi-url"
import Image from "next/image"
import { JSXElementConstructor, SVGProps } from "react"

const baseStyles =
	"rounded-full w-full aspect-square border border-primary-200 flex items-center justify-center justify-center"

const avatarIntent: Record<Intent, string> = {
	primary: "border-primary-400/75",
	neutral: "border-neutral-400/75",
	densed: "border-densed-400/75",
	sun: "border-sun-400/75",
	coral: "border-coral-400/75",
	mint: "border-mint-400/75",
}

interface AvatarProps {
	src?: string
	alt?: string
	className?: string
	width?: number
	height?: number
	intent?: Intent
	FallbackIcon?: JSXElementConstructor<SVGProps<SVGSVGElement>>
	iconClassName?: string
}

export const Avatar = ({
	className,
	src,
	alt = "Avatar Image",
	width = 64,
	height = 64,
	FallbackIcon = IconUserLarge,
	iconClassName,
	intent = "densed",
}: AvatarProps) => {
	if (!src && !FallbackIcon) {
		throw new Error("Avatar: src or FallbackIcon must be provided")
	}

	const intentStyles = avatarIntent[intent]

	if (!src) {
		return (
			<div className={classNames(baseStyles, intentStyles, className)}>
				<FallbackIcon
					width={width}
					height={height}
					className={classNames(className, iconClassName)}
				/>
			</div>
		)
	}

	return (
		<Image
			src={getStrapiUrl(src)}
			alt={alt}
			width={width}
			height={height}
			className={classNames(baseStyles, intentStyles, className)}
		/>
	)
}
