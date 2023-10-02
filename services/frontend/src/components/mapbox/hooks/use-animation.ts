import { useCallback, useEffect, useRef } from "react"

export const useAnimation = ({
	paused = false,
	onFrame,
}: {
	paused?: boolean
	onFrame: (frame: number) => void
}) => {
	const frameRef = useRef(0)
	const intervalRef = useRef<number>()

	const updateFrame = useCallback(() => {
		onFrame(frameRef.current)
		frameRef.current += 1

		intervalRef.current = requestAnimationFrame(updateFrame)
	}, [onFrame, paused])

	useEffect(() => {
		if (!paused) {
			intervalRef.current = requestAnimationFrame(updateFrame)
		} else if (paused && intervalRef.current) {
			cancelAnimationFrame(intervalRef.current)
			intervalRef.current = undefined
		}
	}, [paused])

	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				cancelAnimationFrame(intervalRef.current)
			}
		}
	}, [])
}
