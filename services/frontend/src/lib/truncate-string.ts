export const truncateString = (str: string, length: number = 64): string => {
	if (str.length - 1 <= length) {
		return str
	}

	return str.slice(0, length) + "…"
}
