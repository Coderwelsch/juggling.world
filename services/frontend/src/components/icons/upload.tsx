// icon:upload | Fontawesome https://fontawesome.com/ | Fontawesome
import * as React from "react"

function IconUpload(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 512 512"
			fill="currentColor"
			height="1em"
			width="1em"
			{...props}
		>
			<path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352h128c0 35.3 28.7 64 64 64s64-28.7 64-64h128c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64v-32c0-35.3 28.7-64 64-64zm368 104c13.3 0 24-10.7 24-24s-10.7-24-24-24-24 10.7-24 24 10.7 24 24 24z" />
		</svg>
	)
}

export default IconUpload
