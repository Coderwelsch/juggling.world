// icon:circle | Bootstrap https://icons.getbootstrap.com/ | Bootstrap
import * as React from "react"

function IconCircle(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			fill="currentColor"
			viewBox="0 0 16 16"
			height="1em"
			width="1em"
			{...props}
		>
			<path d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z" />
		</svg>
	)
}

export default IconCircle
