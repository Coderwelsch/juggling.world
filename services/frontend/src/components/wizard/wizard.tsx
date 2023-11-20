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
	footer?: (props: {
		currentStep: number
		previous: (() => void) | undefined
		next: (() => void) | undefined
	}) => React.ReactNode
	header?: (currentStep: number, goTo: (index: number) => void) => ReactNode
	initialStep?: number
	children: ReactNode
}

interface WizardContextProps {
	nextStep?: () => void
	previousStep?: () => void
}

const WizardContext = createContext<WizardContextProps>({})

export const useWizardContext = () => {
	const wizardContext = useContext(WizardContext)

	if (!wizardContext) {
		throw new Error("Wizard context not found")
	}

	return wizardContext
}

export const Wizard = ({
	initialStep = 0,
	currentStep = 0,
	children,
	header,
	footer,
}: WizardProps) => {
	const [internalCurrentStep, setInternalCurrentStep] = useState(
		currentStep || initialStep,
	)

	const nextStep = () => {
		if (internalCurrentStep + 1 > steps.length - 1) {
			return internalCurrentStep
		}

		setInternalCurrentStep(internalCurrentStep + 1)
	}

	const previousStep = () => {
		if (internalCurrentStep - 1 < 0) {
			return internalCurrentStep
		}

		setInternalCurrentStep(internalCurrentStep - 1)
	}

	useEffect(() => {
		setInternalCurrentStep(currentStep)
	}, [currentStep])

	const steps = Children.toArray(children)
	const currentStepContent = steps[internalCurrentStep]

	const isPreviousStepAvailable = internalCurrentStep - 1 >= 0
	const isNextStepAvailable = internalCurrentStep + 1 <= steps.length - 1

	return (
		<WizardContext.Provider
			value={{
				previousStep: isPreviousStepAvailable
					? previousStep
					: undefined,
				nextStep: isNextStepAvailable ? nextStep : undefined,
			}}
		>
			{header &&
				header(internalCurrentStep, (index: number) =>
					setInternalCurrentStep(index),
				)}

			{currentStepContent}

			{footer &&
				footer({
					currentStep: internalCurrentStep,
					previous: isPreviousStepAvailable
						? previousStep
						: undefined,
					next: isNextStepAvailable ? nextStep : undefined,
				})}
		</WizardContext.Provider>
	)
}
