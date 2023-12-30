import { useEffect, useState } from "react"

export const useBrowserSize = () => {
	const [browserSize, setBrowserSize] = useState({
		width: 0,
		height: 0,
	})

	useEffect(() => {
		const handleResize = () => {
			setBrowserSize({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}

		window.addEventListener("resize", handleResize)

		if (
			browserSize.width !== window.innerWidth ||
			browserSize.height !== window.innerHeight
		) {
			handleResize()
		}

		return () => {
			window.removeEventListener("resize", handleResize)
		}
	}, [browserSize])

	return browserSize
}
