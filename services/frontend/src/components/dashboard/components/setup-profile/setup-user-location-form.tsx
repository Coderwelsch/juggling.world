import { Avatar } from "@/src/components/avatar/avatar"
import { Button } from "@/src/components/button/button"
import Dialog from "@/src/components/dialog/dialog"
import { FormField } from "@/src/components/form/form-field/form-field"
import { Headline } from "@/src/components/headline/headline"
import { IconBxChevronRight } from "@/src/components/icons/bx-chevron-right"
import IconUserLarge from "@/src/components/icons/user-large"
import { useWizardContext } from "@/src/components/wizard/wizard"
import { useSearchLocation } from "@/src/hooks/data/map/use-search-location"
import { useUserProfileContext } from "@/src/hooks/data/user/use-profile-data"
import { useUpdateProfileMutation } from "@/src/hooks/data/user/use-update-profile"
import mapboxgl from "mapbox-gl"
import { useCallback, useEffect, useState } from "react"

export const SetupUserLocationForm = () => {
	const user = useUserProfileContext()
	const wizardContext = useWizardContext()
	const [location, setLocation] = useState<mapboxgl.LngLat | null>(null)

	const updateUser = useUpdateProfileMutation()

	const handleSubmit = useCallback(() => {
		if (!user) {
			return
		}

		if (!location) {
			return
		}

		updateUser.mutate(
			JSON.stringify({
				location: {
					latitude: location.lat,
					longitude: location.lng,
				},
			}),
		)
	}, [location, updateUser, user])

	const [searchString, setSearchString] = useState("")

	const { searchResults, isSearching } = useSearchLocation(searchString)

	useEffect(() => {
		if (!updateUser.isSuccess) {
			return
		}

		if (!wizardContext) {
			return
		}

		wizardContext.nextStep?.()
	}, [updateUser.isSuccess, wizardContext])

	const handleLocationChange = (location: mapboxgl.LngLat) => {
		setLocation(location)
	}

	const [isSearchFieldFocused, setIsSearchFieldFocused] = useState(false)

	return (
		<>
			<Dialog.Body
				className={
					"flex h-full max-h-[30rem] max-w-4xl flex-row overflow-visible p-0"
				}
			>
				<FormField.LocationField
					location={location ?? new mapboxgl.LngLat(0, 0)}
					onChange={handleLocationChange}
					className={"h-full w-3/5 rounded-l-xl"}
					markerIcon={
						user?.avatar?.url ? (
							<Avatar src={user.avatar.url} />
						) : (
							<IconUserLarge className={"h-full w-full"} />
						)
					}
				/>

				<div
					className={
						"flex w-2/5 shrink-0 flex-col gap-4 p-6 text-slate-50"
					}
				>
					<div className={"flex flex-col gap-4"}>
						<Headline size={4}>Your «Home» Location</Headline>

						<p className={"text-sm opacity-60"}>
							Your home location is like your home base where you
							play the most of the time or where others can find
							you.
						</p>

						<p className={"text-sm opacity-60"}>
							We recommend you to set your home location not
							exactly to your home but to a nearby location like a
							park or a public place.
						</p>
					</div>

					<FormField className={"gap-2"}>
						<FormField.SearchField
							className={"w-full"}
							placeholder={"Search for a city, country, …"}
							value={searchString}
							onChange={(event) => {
								setSearchString(event.target.value)
							}}
							onFocus={() => setIsSearchFieldFocused(true)}
							onBlur={() => {
								setTimeout(() => {
									setIsSearchFieldFocused(false)
								}, 200)
							}}
						/>

						{isSearching && (
							<p className={"text-sm text-slate-100/80"}>
								Searching for locations…
							</p>
						)}

						{searchResults.length > 0 && isSearchFieldFocused && (
							<FormField.SearchFieldResultContainer
								className={"max-h-60"}
							>
								{searchResults.map((result) => (
									<FormField.SearchFieldResult
										key={result.place_name}
										onClick={() => {
											setSearchString(result.text)
											setLocation(
												new mapboxgl.LngLat(
													result.center[0],
													result.center[1],
												),
											)
										}}
									>
										<div
											className={
												"flex flex-col items-start text-left"
											}
										>
											<span
												className={
													"text-xs font-semibold"
												}
											>
												{result.text}
											</span>

											<span
												className={
													"text-xs font-normal text-primary-100/60"
												}
											>
												{result.place_name}
											</span>
										</div>
									</FormField.SearchFieldResult>
								))}
							</FormField.SearchFieldResultContainer>
						)}
					</FormField>
				</div>
			</Dialog.Body>

			<div className={"flex flex-row gap-2"}>
				<Button
					intent={"primary"}
					onClick={handleSubmit}
					loading={updateUser.isLoading}
					disabled={!location}
					IconAfter={
						<IconBxChevronRight className={"h-full w-full"} />
					}
				>
					Continue
				</Button>
			</div>
		</>
	)
}
