import {
	createContext,
	ReactElement,
	ReactNode,
	useContext,
} from "react"

export interface WizardProps {
	currentStep?: number
	totalSteps: number
	header?: (currentStep: number) => ReactNode
	children: ReactElement
	onNextStep?: (next: number) => void
	onPreviousStep?: (previous: number) => void
	onClose: () => void
}

interface WizardContextProps {
	nextStep?: () => void
	previousStep?: () => void
	close: () => void
}

const WizardContext = createContext<WizardContextProps>({
	close: () => {},
})

export const useWizardContext = () => {
	const wizardContext = useContext(WizardContext)

	if (!wizardContext) {
		throw new Error("Wizard context not found")
	}

	return wizardContext
}

export const Wizard = ({
	currentStep = 0,
	totalSteps,
	children,
	header,
	onClose,
	onNextStep,
	onPreviousStep,
}: WizardProps) => {
	const nextStep = () => {
		let newStep = currentStep + 1

		if (newStep > totalSteps - 1) {
			newStep = currentStep
		}

		if (onNextStep) {
			onNextStep(newStep)
		}
	}

	const previousStep = () => {
		let newStep = currentStep - 1

		if (newStep < 0) {
			newStep = 0
		}

		if (onPreviousStep) {
			onPreviousStep(newStep)
		}
	}

	const isPreviousStepAvailable = currentStep - 1 >= 0
	const isNextStepAvailable = currentStep + 1 <= totalSteps - 1

	return (
		<WizardContext.Provider
			value={{
				close: onClose,
				previousStep: isPreviousStepAvailable
					? previousStep
					: undefined,
				nextStep: isNextStepAvailable ? nextStep : undefined,
			}}
		>
			{header && header(currentStep)}

			{children}
		</WizardContext.Provider>
	)
}
