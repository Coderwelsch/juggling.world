// icon:location | Ionicons https://ionicons.com/ | Ionic Framework
import * as React from "react"

function IconLocation(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 512 512"
			fill="currentColor"
			height="1em"
			width="1em"
			{...props}
		>
			<path d="M288 192 A32 32 0 0 1 256 224 A32 32 0 0 1 224 192 A32 32 0 0 1 288 192 z" />
			<path d="M256 32c-88.22 0-160 68.65-160 153 0 40.17 18.31 93.59 54.42 158.78 29 52.34 62.55 99.67 80 123.22a31.75 31.75 0 0051.22 0c17.42-23.55 51-70.88 80-123.22C397.69 278.61 416 225.19 416 185c0-84.35-71.78-153-160-153zm0 224a64 64 0 1164-64 64.07 64.07 0 01-64 64z" />
		</svg>
	)
}

export default IconLocation
