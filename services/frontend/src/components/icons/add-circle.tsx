// icon:add-circle | Ionicons https://ionicons.com/ | Ionic Framework
import * as React from "react"

function IconAddCircle(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 512 512"
			fill="currentColor"
			height="1em"
			width="1em"
			{...props}
		>
			<path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm80 224h-64v64a16 16 0 01-32 0v-64h-64a16 16 0 010-32h64v-64a16 16 0 0132 0v64h64a16 16 0 010 32z" />
		</svg>
	)
}

export default IconAddCircle
