import { AvatarChangeForm } from "@/src/components/avatar-change-form/avatar-change-form"
import { Breadcrum } from "@/src/components/breadcrum/breadcrum"
import Dialog from "@/src/components/dialog/dialog"
import IconCircleFill from "@/src/components/icons/circle-fill"
import IconTickCircle from "@/src/components/icons/tick-circle"
import { Wizard } from "@/src/components/wizard/wizard"
import {
	useProfileData,
	UserProfileData,
} from "@/src/hooks/data/user/use-profile-data"
import { classNames } from "@/src/lib/class-names"
import { ReactNode, useCallback, useMemo, useState } from "react"

interface SetupProfileDialogProps {
	isVisible: boolean
	onClose: () => void
}

export const useUserNeedsSetup = () => {
	const { data: user } = useProfileData()

	if (!user) {
		return null
	}

	const checks = {
		avatar: user.avatar === null,
		location: user.location === null,
		aboutMe: user.aboutMe === null,
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
	content: (onDone: () => void) => ReactNode
}

const STEPS_CONFIG: Array<StepItem> = [
	{
		key: "avatar",
		name: "Avatar",
		content: () => <AvatarChangeForm />,
	},
	{
		key: "location",
		name: "Location",
		content: () => (
			<Dialog.Body>
				<p>Hello</p>
			</Dialog.Body>
		),
	},
	{
		key: "disciplines",
		name: "Disciplines",
		content: () => (
			<Dialog.Body>
				<p>Hello</p>
			</Dialog.Body>
		),
	},
]

export const Header = ({ currentStep }: { currentStep: number }) => {
	return (
		<Dialog.Header title={"Setup your profile"}>
			<Breadcrum>
				{STEPS_CONFIG.map((item, index) => {
					const isDone = currentStep > index
					const isActive = currentStep === index

					return (
						<Breadcrum.Item
							key={`${index}-${item.name}`}
							active={isActive}
							IconBefore={
								isDone ? (
									<IconTickCircle
										className={
											isActive
												? "text-violet-500"
												: "text-emerald-500"
										}
									/>
								) : (
									<div
										className={
											"relative flex h-full w-full items-center justify-center"
										}
									>
										{isActive && (
											<IconCircleFill
												className={`absolute left-1/2 top-1/2 z-10 h-1 w-1 -translate-x-1/2 -translate-y-1/2 text-white`}
											/>
										)}

										<IconCircleFill />
									</div>
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

	const handleStepDone = useCallback(() => {
		if (currentStep === filteredSteps.length - 1) {
			onClose()
			return
		}

		if (currentStep < filteredSteps.length - 1) {
			setCurrentStep((prev) => prev + 1)
		}

		if (currentStep > filteredSteps.length - 1) {
			setCurrentStep((prev) => prev - 1)
		}
	}, [currentStep, filteredSteps, onClose])

	const handleOnClose = useCallback(() => {
		setCurrentStep(0)
		onClose()
	}, [onClose])

	return (
		<Dialog
			isVisible={isVisible}
			onClose={handleOnClose}
		>
			<Wizard
				currentStep={currentStep}
				header={(currentStep) => <Header currentStep={currentStep} />}
			>
				{filteredSteps.map((step, index) =>
					step.content(handleStepDone),
				)}
			</Wizard>
		</Dialog>
	)
}
