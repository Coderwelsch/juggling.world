import type { Config } from "tailwindcss"
import typography from "@tailwindcss/typography"
import forms from "@tailwindcss/forms"

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: [`var(--font-poppins)`, "sans-serif"],
			},
			colors: {
				primary: {
					"50": "hsl(270, 100%, 98%)",
					"100": "hsl(269, 100%, 95%)",
					"200": "hsl(267, 100%, 92%)",
					"300": "hsl(268, 95%, 85%)",
					"400": "hsl(269, 94%, 75%)",
					"500": "hsl(270, 89%, 65%)",
					"600": "hsl(270, 80%, 56%)",
					"700": "hsl(271, 70%, 47%)",
					"800": "hsl(272, 66%, 39%)",
					"900": "hsl(273, 64%, 32%)",
					"950": "hsl(272, 85%, 24%)",
				},
			},
		},
	},
	plugins: [typography, forms],
}
export default config
