import {
	StepItem,
	STEPS_CONFIG,
} from "@/src/components/dashboard/components/setup-profile/constants"
import { Header } from "@/src/components/dashboard/components/setup-profile/setup-dialog-header"
import Dialog from "@/src/components/dialog/dialog"
import { Wizard } from "@/src/components/wizard/wizard"
import { useUserNeedsSetup } from "@/src/hooks/data/user/use-user-needs-setup"
import { Content } from "next/dist/compiled/@next/font/dist/google"
import { useEffect, useState } from "react"

interface SetupProfileDialogProps {
	isVisible: boolean
	onClose: () => void
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
		// prefilled with the last success step
		const steps: Array<StepItem["key"]> = ["finalize"]

		if (!internalUserNeedsSetup || isVisible) {
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
	}, [internalUserNeedsSetup, isVisible])

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

	const step = filteredSteps[currentStep]
	const Content = step?.content

	return (
		<Dialog
			isVisible={isVisible}
			onClose={handleOnClose}
		>
			<Wizard
				currentStep={currentStep}
				totalSteps={filteredSteps.length}
				onNextStep={(index) => setCurrentStep(index)}
				onPreviousStep={(index) => setCurrentStep(index)}
				onClose={handleOnClose}
				header={(currentStep) => (
					<Header
						currentStep={currentStep}
						steps={filteredSteps}
					/>
				)}
			>
				{Content && <Content />}
			</Wizard>
		</Dialog>
	)
}
