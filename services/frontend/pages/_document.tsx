import { classNames } from "@/src/lib/class-names"
import { poppinsFont } from "@/src/lib/fonts"
import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
	return (
		<Html
			lang="en"
			className={classNames(`bg-space-800`, poppinsFont.className)}
		>
			<Head />

			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
