// icon:tick-circle | Teeny Icons https://teenyicons.com/ | Anja van Staden
import * as React from "react"

function IconTickCircle(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			fill="none"
			viewBox="0 0 15 15"
			height="1em"
			width="1em"
			{...props}
		>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M0 7.5a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0zm7.072 3.21l4.318-5.398-.78-.624-3.682 4.601L4.32 7.116l-.64.768 3.392 2.827z"
				clipRule="evenodd"
			/>
		</svg>
	)
}

export default IconTickCircle
