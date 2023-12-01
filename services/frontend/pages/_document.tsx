import { classNames } from "@/src/lib/class-names"
import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
	return (
		<Html lang="en">
			<Head />

			<body
				className={classNames(
					`bg-slate-950 text-slate-100 scroll-smooth h-full`,
				)}
			>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
