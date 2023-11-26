import { AvatarChangeForm } from "@/src/components/avatar-change-form/avatar-change-form"
import { Breadcrum } from "@/src/components/breadcrum/breadcrum"
import { SetupUserLocationForm } from "@/src/components/dashboard/components/setup-profile/setup-user-location-form"
import Dialog from "@/src/components/dialog/dialog"
import { Headline } from "@/src/components/headline/headline"
import IconTickCircle from "@/src/components/icons/tick-circle"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { Wizard } from "@/src/components/wizard/wizard"
import { useUserNeedsSetup } from "@/src/hooks/data/user/use-user-needs-setup"
import { classNames } from "@/src/lib/class-names"
import { getStrapiUrl } from "@/src/lib/get-strapi-url"
import { useAllDisciplines } from "@/src/queries/all-disciplines"
import Image from "next/image"
import { ReactNode, useEffect, useState } from "react"

interface SetupProfileDialogProps {
	isVisible: boolean
	onClose: () => void
}

interface StepItem {
	key: string
	name: string
	content: () => ReactNode
}

const SetUserDisciplines = () => {
	const allDisciplines = useAllDisciplines()

	console.log("all disciplines", allDisciplines)

	return (
		<Dialog.Body className={"flex h-full max-h-96 flex-row p-0"}>
			<LoaderOverlay shown={allDisciplines.loading} />

			<div className={"w-1/2"}>
				{allDisciplines.data?.disciplines.data.map((discipline) => (
					<div
						key={discipline.id}
						className={"flex flex-row gap-2"}
					>
						{discipline.attributes.icon?.data.attributes.url && (
							<Image
								src={getStrapiUrl(
									discipline.attributes.icon?.data.attributes
										.url,
								)}
								width={32}
								height={32}
								alt={discipline.attributes.name}
							/>
						)}

						<div>
							<Headline size={6}>
								{discipline.attributes.name}
							</Headline>
						</div>
					</div>
				))}
			</div>

			<div className={"w-1/2 p-3 py-6 text-space-50"}>
				<Headline size={4}>Disciplines</Headline>

				<p className={"text-space-100/60"}>
					Select the disciplines you are interested in
				</p>
			</div>
		</Dialog.Body>
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
		content: () => <SetupUserLocationForm key="location" />,
	},
	{
		key: "disciplines",
		name: "Disciplines",
		content: () => <SetUserDisciplines key="disciplines" />,
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
