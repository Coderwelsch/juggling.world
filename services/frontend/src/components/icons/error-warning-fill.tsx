// icon:error-warning-fill | Remix Icon https://remixicon.com/ | Remix Design
import * as React from "react"

function IconErrorWarningFill(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			height="1em"
			width="1em"
			{...props}
		>
			<path
				fill="none"
				d="M0 0h24v24H0z"
			/>
			<path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" />
		</svg>
	)
}

export default IconErrorWarningFill
