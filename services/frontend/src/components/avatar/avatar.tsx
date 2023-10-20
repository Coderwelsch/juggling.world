import { classNames } from "@/src/lib/class-names"
import { getStrapiUrl } from "@/src/lib/get-strapi-url"
import Image from "next/image"

interface AvatarProps {
	src: string
	alt?: string
	className?: string
	width?: number
	height?: number
}

export const Avatar = ({
	className,
	src,
	alt = "Avatar Image",
	width = 32,
	height = 32,
}: AvatarProps) => {
	return (
		<Image
			src={getStrapiUrl(src)}
			alt={alt}
			width={width}
			height={height}
			className={classNames(
				"rounded-full w-full aspect-square",
				className,
			)}
		/>
	)
}
