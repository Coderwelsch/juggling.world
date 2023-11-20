// icon:circle-fill | Bootstrap https://icons.getbootstrap.com/ | Bootstrap
import * as React from "react"

function IconCircleFill(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			fill="currentColor"
			viewBox="0 0 16 16"
			height="1em"
			width="1em"
			{...props}
		>
			<path d="M16 8 A8 8 0 0 1 8 16 A8 8 0 0 1 0 8 A8 8 0 0 1 16 8 z" />
		</svg>
	)
}

export default IconCircleFill
