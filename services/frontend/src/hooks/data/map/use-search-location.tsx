import { useDebounce } from "@/src/hooks/use-debounce"
import { NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN } from "@/src/lib/constants"
import { useEffect, useState } from "react"

export const useSearchLocation = (searchString: string) => {
	const [searchResults, setSearchResults] = useState<
		Array<{
			name: string
			place_name: string
			center: [number, number]
			text: string
		}>
	>([])

	const [isSearching, setIsSearching] = useState(false)

	const debouncedSearchString = useDebounce(searchString, 500)

	useEffect(() => {
		setIsSearching(true)

		fetch(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${debouncedSearchString}.json?access_token=${NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
		)
			.then((response) => response.json())
			.then((data) => {
				setSearchResults(data.features)
				setIsSearching(false)
			})
	}, [debouncedSearchString])

	return {
		searchResults,
		isSearching,
	}
}
