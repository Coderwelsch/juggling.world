import { AvatarChangeForm } from "@/src/components/avatar-change-form/avatar-change-form"
import { Breadcrum } from "@/src/components/breadcrum/breadcrum"
import Dialog from "@/src/components/dialog/dialog"
import IconCircleFill from "@/src/components/icons/circle-fill"
import IconTickCircle from "@/src/components/icons/tick-circle"
import { Wizard } from "@/src/components/wizard/wizard"
import {
	useProfileData,
	UserProfileData,
	useUserProfileContext,
} from "@/src/hooks/data/user/use-profile-data"
import { classNames } from "@/src/lib/class-names"
import { ReactNode, useCallback, useMemo, useState } from "react"

interface SetupProfileDialogProps {
	isVisible: boolean
	onClose: () => void
}

export const useUserNeedsSetup = () => {
	const user = useUserProfileContext()

	if (!user) {
		return null
	}

	console.log("userrrr", user)

	const checks = {
		avatar: user.avatar !== null,
		location: user.location !== null,
		aboutMe: user.aboutMe !== null,
		disciplines: Boolean(user.disciplines),
	}

	return {
		hasFinishedSetup: Object.values(checks).every((value) => !value),
		checks,
	}
}

interface StepItem {
	key: string
	name: string
	content: () => ReactNode
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
		content: () => (
			<Dialog.Body key="location">
				<p>Hello</p>
			</Dialog.Body>
		),
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

	const filteredSteps = useMemo(() => {
		if (!userNeedsSetup) {
			return []
		}

		const steps: Array<StepItem["key"]> = []

		const { avatar, disciplines, aboutMe, location } = userNeedsSetup.checks

		console.log(userNeedsSetup.checks)

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

		return STEPS_CONFIG.filter((config) => steps.includes(config.key))
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
				{filteredSteps.map((step, index) => step.content())}
			</Wizard>
		</Dialog>
	)
}
