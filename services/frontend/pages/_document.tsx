import { classNames } from "@/src/lib/class-names"
import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
	return (
		<Html lang="en">
			<Head />

			<body
				className={classNames(
					`text-space-900 bg-space-950 scroll-smooth h-full`,
				)}
			>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
