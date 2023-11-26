import { AvatarChangeForm } from "@/src/components/avatar-change-form/avatar-change-form"
import { Breadcrum } from "@/src/components/breadcrum/breadcrum"
import { Button } from "@/src/components/button/button"
import Dialog from "@/src/components/dialog/dialog"
import { FormField } from "@/src/components/form/form-field/form-field"
import { Headline } from "@/src/components/headline/headline"
import { IconBxChevronRight } from "@/src/components/icons/bx-chevron-right"
import IconTickCircle from "@/src/components/icons/tick-circle"
import { DotMarker } from "@/src/components/mapbox/marker/dot-marker"
import { useWizardContext, Wizard } from "@/src/components/wizard/wizard"
import { useSearchLocation } from "@/src/hooks/data/map/use-search-location"
import { useUserProfileContext } from "@/src/hooks/data/user/use-profile-data"
import { useUpdateProfileMutation } from "@/src/hooks/data/user/use-update-profile"
import { useUserNeedsSetup } from "@/src/hooks/data/user/use-user-needs-setup"
import { classNames } from "@/src/lib/class-names"
import mapboxgl from "mapbox-gl"
import { ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { Map } from "../../../mapbox/map"
import { Avatar } from "@/src/components/avatar/avatar"

interface SetupProfileDialogProps {
	isVisible: boolean
	onClose: () => void
}

interface StepItem {
	key: string
	name: string
	content: () => ReactNode
}

interface SelectLocationInputProps {
	location?: mapboxgl.LngLat
	onChange: (location: mapboxgl.LngLat) => void
	className?: string
	markerIcon?: ReactNode
}

const SelectLocationInput = ({
	location,
	onChange,
	className,
	markerIcon,
}: SelectLocationInputProps) => {
	const [isMapLoaded, setIsMapLoaded] = useState(false)
	const mapRef = useRef<mapboxgl.Map | null>(null)

	const latitude = location?.lat ?? 0
	const longitude = location?.lng ?? 0

	// fly to current location
	useEffect(() => {
		if (!isMapLoaded) {
			return
		}

		if (!mapRef.current) {
			return
		}

		if (!latitude || !longitude) {
			return
		}

		// make shure to have the marker in the viewport
		mapRef.current.flyTo({
			center: [longitude, latitude],
			zoom: Math.max(12, mapRef.current.getZoom()),
			essential: true,
			duration: 500,
		})
	}, [isMapLoaded, latitude, longitude])

	return (
		<div className={classNames("w-full h-full overflow-hidden", className)}>
			<Map
				onLoad={(map) => {
					mapRef.current = map.target
					setIsMapLoaded(true)
				}}
				initialViewState={{
					longitude,
					latitude,
					zoom: 1,
				}}
				onClick={(event) => {
					onChange(event.lngLat)
				}}
			>
				{location && (
					<DotMarker
						location={[longitude, latitude]}
						onClick={() => {}}
						active={true}
						focused={true}
						icon={markerIcon}
					/>
				)}
			</Map>
		</div>
	)
}

export const ChangeUserLocationForm = () => {
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

		setTimeout(() => {
			if (!wizardContext) {
				return
			}

			wizardContext.nextStep?.()
		}, 2000)
	}, [updateUser.isSuccess, wizardContext])

	const handleLocationChange = (location: mapboxgl.LngLat) => {
		setLocation(location)
	}

	const [isSearchFieldFocused, setIsSearchFieldFocused] = useState(false)

	return (
		<>
			<Dialog.Body
				className={
					"flex h-full max-h-[30rem] max-w-4xl flex-row overflow-y-scroll p-0"
				}
			>
				<SelectLocationInput
					location={location ?? new mapboxgl.LngLat(0, 0)}
					onChange={handleLocationChange}
					className={"h-full w-full"}
					markerIcon={<Avatar src={user?.avatar?.url ?? ""} />}
				/>

				<div
					className={
						"flex w-1/2 shrink-0 flex-col gap-4 p-6 text-space-50"
					}
				>
					<div className={"flex flex-col gap-1"}>
						<Headline size={4}>Public Location</Headline>

						<p className={"text-sm text-violet-50/80"}>
							Your location is public. We recommend you to not set
							the point to your real home/address, but a nearby
							location instead.
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
							<p className={"text-sm text-neutral-100/80"}>
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
													"text-xs font-normal text-violet-100/60"
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
					intent={updateUser.isSuccess ? "success" : "primary"}
					onClick={handleSubmit}
					loading={updateUser.isLoading}
					disabled={!location}
					IconAfter={
						<IconBxChevronRight className={"h-full w-full"} />
					}
				>
					{updateUser.isSuccess ? "Saved" : "Continue"}
				</Button>
			</div>
		</>
	)
}

const STEPS_CONFIG: Array<StepItem> = [
	{
		key: "avatar",
		name: "Avatar",
		content: () => <AvatarChangeForm key="avatar" />,
	},
	{
		key: "location",
		name: "Location",
		content: () => <ChangeUserLocationForm key="location" />,
	},
	{
		key: "disciplines",
		name: "Disciplines",
		content: () => (
			<Dialog.Body key="disciplines">
				<p>Hello</p>
			</Dialog.Body>
		),
	},
]

export const Header = ({
	currentStep,
	steps,
}: {
	currentStep: number
	steps: Array<StepItem>
}) => {
	return (
		<Dialog.Header title={"Setup your profile"}>
			<Breadcrum>
				{steps.map((item, index) => {
					const isDone = currentStep > index
					const isActive = currentStep === index

					return (
						<Breadcrum.Item
							key={`${index}-${item.name}`}
							active={isActive}
							IconBefore={
								isDone && (
									<IconTickCircle
										className={
											isActive
												? "text-violet-500"
												: "text-emerald-500"
										}
									/>
								)
							}
						>
							<span
								className={classNames(
									isDone && "text-emerald-400",
									isActive && "text-violet-500",
								)}
							>
								{item.name}
							</span>
						</Breadcrum.Item>
					)
				})}
			</Breadcrum>
		</Dialog.Header>
	)
}

export const SetupProfileDialog = ({
	isVisible,
	onClose,
}: SetupProfileDialogProps) => {
	const userNeedsSetup = useUserNeedsSetup()
	const [internalUserNeedsSetup, setInternalUserNeedsSetup] =
		useState(userNeedsSetup)

	const [filteredSteps, setFilteredSteps] = useState<StepItem[]>([])

	useEffect(() => {
		const steps: Array<StepItem["key"]> = []

		if (!internalUserNeedsSetup) {
			return
		}

		const { avatar, disciplines, aboutMe, location } =
			internalUserNeedsSetup.checks

		if (!avatar) {
			steps.push("avatar")
		}

		if (!location) {
			steps.push("location")
		}

		if (!aboutMe) {
			steps.push("aboutMe")
		}

		if (!disciplines) {
			steps.push("disciplines")
		}

		setFilteredSteps(
			STEPS_CONFIG.filter((config) => steps.includes(config.key)),
		)
	}, [internalUserNeedsSetup])

	useEffect(() => {
		if (userNeedsSetup) {
			return
		}

		setInternalUserNeedsSetup(userNeedsSetup)
	}, [userNeedsSetup])

	const [currentStep, setCurrentStep] = useState(0)

	const handleOnClose = () => {
		onClose()

		setTimeout(() => {
			setCurrentStep(0)
		}, 500)
	}

	return (
		<Dialog
			isVisible={isVisible}
			onClose={handleOnClose}
		>
			<Wizard
				currentStep={currentStep}
				onNextStep={(index) => setCurrentStep(index)}
				onPreviousStep={(index) => setCurrentStep(index)}
				header={(currentStep) => (
					<Header
						currentStep={currentStep}
						steps={filteredSteps}
					/>
				)}
			>
				{filteredSteps.map((step) => step.content())}
			</Wizard>
		</Dialog>
	)
}
