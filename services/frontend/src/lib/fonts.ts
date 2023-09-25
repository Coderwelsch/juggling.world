import { Poppins } from "next/font/google"

export const poppinsFont = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["400", "600", "800", "900"],
})
