import type { Config } from "tailwindcss"

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
				space: {
					50: "#dde1fd",
					100: "#9AA6EF",
					200: "#7688EA",
					300: "#5369E4",
					400: "#304ADF",
					500: "#1F38C7",
					600: "#192EA3",
					700: "#142480",
					800: "#0E1A5D",
					900: "#070C2C",
					950: "#030614",
				},
			},
		},
	},
	plugins: [],
}
export default config
