// update tailwind colors with this link:
// https://www.tints.dev/?densed=9B85C7&brand=2522FC&sun=FAEB00&red=EF4444&pine=00F0A8&mint=00F0A8&blue=5200FA&primary=5200FA&purple=A855F7&coral=F53D07&neutral=C2BCD0

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
		fontFamily: {
			sans: [`var(--font-poppins)`, "sans-serif"],
		},
		colors: {
			densed: {
				50: "#F6F5FA",
				100: "#EBE7F4",
				200: "#D7CEE9",
				300: "#C3B6DD",
				400: "#AF9DD2",
				500: "#9B85C7",
				600: "#7557B2",
				700: "#573F88",
				800: "#3A2A5B",
				900: "#1D152D",
				950: "#100B18",
			},
			sun: {
				50: "#FFFDE5",
				100: "#FFFCCC",
				200: "#FFF899",
				300: "#FFF461",
				400: "#FFF12E",
				500: "#FAEB00",
				600: "#C7BA00",
				700: "#948A00",
				800: "#665F00",
				900: "#333000",
				950: "#191800",
			},
			mint: {
				50: "#E5FFF7",
				100: "#C7FFEE",
				200: "#94FFDF",
				300: "#5CFFCE",
				400: "#29FFBF",
				500: "#00F0A8",
				600: "#00C288",
				700: "#008F64",
				800: "#006144",
				900: "#002E20",
				950: "#001912",
			},
			primary: {
				50: "#F1EBFF",
				100: "#E4D6FF",
				200: "#C5A8FF",
				300: "#AA80FF",
				400: "#8B52FF",
				500: "#7029FF",
				600: "#5200FA",
				700: "#3F00BD",
				800: "#2A0080",
				900: "#14003D",
				950: "#0A001F",
			},
			coral: {
				50: "#FEECE6",
				100: "#FED9CD",
				200: "#FCB29C",
				300: "#FB8C6A",
				400: "#F96639",
				500: "#F53D07",
				600: "#C63306",
				700: "#952604",
				800: "#631903",
				900: "#320D01",
				950: "#190601",
			},
			neutral: {
				50: "#FAF9FB",
				100: "#F4F3F7",
				200: "#E6E4EC",
				300: "#DCD8E4",
				400: "#CEC9D9",
				500: "#C2BCD0",
				600: "#978DAF",
				700: "#6F638D",
				800: "#4A415D",
				900: "#262230",
				950: "#131118",
			},
		},
	},
	plugins: [typography, forms],
}
export default config
