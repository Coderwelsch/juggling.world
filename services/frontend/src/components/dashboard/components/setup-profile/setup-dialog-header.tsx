import { Breadcrum } from "@/src/components/breadcrum/breadcrum"
import { StepItem } from "@/src/components/dashboard/components/setup-profile/setup-profile-dialog"
import Dialog from "@/src/components/dialog/dialog"
import { Headline } from "@/src/components/headline/headline"
import { classNames } from "@/src/lib/class-names"

export const Header = ({
	currentStep,
	steps,
}: {
	currentStep: number
	steps: Array<StepItem>
}) => {
	const activeStep: StepItem | undefined = steps[currentStep]

	if (!activeStep) {
		return null
	}

	const Icon = activeStep.icon
	const iconClassName = activeStep.iconClassName

	return (
		<Dialog.Header
			className={"flex flex-col items-center gap-3"}
			title={
				<>
					<Icon className={classNames("h-14 w-14", iconClassName)} />

					<Headline
						size={2}
						className={"text-center"}
					>
						{activeStep.title}
					</Headline>
				</>
			}
		>
			{activeStep.description ? (
				<p className={"text-slate-50 opacity-60"}>
					{activeStep.description}
				</p>
			) : null}

			{/*{steps.length > 1 ? (*/}
			{/*	<Breadcrum>*/}
			{/*		{steps.map((item, index) => {*/}
			{/*			const isDone = currentStep > index*/}
			{/*			const isActive = currentStep === index*/}
			{/*			const Icon = item.icon*/}

			{/*			return (*/}
			{/*				<Breadcrum.Item*/}
			{/*					key={`${index}-${item.title}`}*/}
			{/*					active={isActive}*/}
			{/*					className={"text-xs"}*/}
			{/*				>*/}
			{/*					{item.title}*/}
			{/*				</Breadcrum.Item>*/}
			{/*			)*/}
			{/*		})}*/}
			{/*	</Breadcrum>*/}
			{/*) : null}*/}
		</Dialog.Header>
	)
}
