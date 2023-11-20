import {
	Children,
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react"

export interface WizardProps {
	currentStep?: number
	header?: (currentStep: number) => ReactNode
	children: ReactNode
	onNextStep?: (next: number) => void
	onPreviousStep?: (previous: number) => void
}

interface WizardContextProps {
	nextStep?: () => void
	hasNextStep: boolean
	previousStep?: () => void
	hasPreviousStep: boolean
}

const WizardContext = createContext<WizardContextProps>({
	hasPreviousStep: false,
	hasNextStep: false,
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
	children,
	header,
	onNextStep,
	onPreviousStep,
}: WizardProps) => {
	const nextStep = () => {
		let newStep = currentStep + 1

		if (newStep > steps.length - 1) {
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

	const steps = Children.toArray(children)
	const currentStepContent = steps[currentStep]

	const isPreviousStepAvailable = currentStep - 1 >= 0
	const isNextStepAvailable = currentStep + 1 <= steps.length - 1

	return (
		<WizardContext.Provider
			value={{
				hasPreviousStep: isPreviousStepAvailable,
				previousStep: isPreviousStepAvailable
					? previousStep
					: undefined,
				nextStep: isNextStepAvailable ? nextStep : undefined,
				hasNextStep: isNextStepAvailable,
			}}
		>
			{header && header(currentStep)}

			{currentStepContent}
		</WizardContext.Provider>
	)
}
