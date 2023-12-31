import { AvatarChangeForm } from "@/src/components/avatar-change-form/avatar-change-form"
import { Button } from "@/src/components/button/button"
import { SetupAboutMeText } from "@/src/components/dashboard/components/setup-profile/setup-about-me-text"
import { StepItem } from "@/src/components/dashboard/components/setup-profile/setup-profile-dialog"
import { SetUserDisciplines } from "@/src/components/dashboard/components/setup-profile/setup-user-disciplines"
import { SetupUserLocationForm } from "@/src/components/dashboard/components/setup-profile/setup-user-location-form"
import Dialog from "@/src/components/dialog/dialog"
import Icon108Bubble from "@/src/components/icons/108-bubble"
import IconFireFill from "@/src/components/icons/fire-fill"
import IconLocation from "@/src/components/icons/location"
import IconTickCircle from "@/src/components/icons/tick-circle"
import IconUserLarge from "@/src/components/icons/user-large"
import { useWizardContext } from "@/src/components/wizard/wizard"
import ConfettiExplosion from "react-confetti-explosion"

const FinalStep = () => {
	const wizardContext = useWizardContext()

	return (
		<>
			<ConfettiExplosion
				zIndex={100}
				duration={8000}
				particleCount={500}
				width={window.innerWidth}
				height={window.innerHeight}
			/>

			<Dialog.Body className={"max-w-md"}>
				<p className={"text-slate-50"}>
					You have successfully completed your profile setup! You can
					now start to use the app.
				</p>
			</Dialog.Body>

			<Button onClick={wizardContext.close}>Start now</Button>
		</>
	)
}

export const STEPS_CONFIG: Array<StepItem> = [
	{
		key: "avatar",
		title: "Avatar",
		description: "Please upload your avatar image here",
		icon: IconUserLarge,
		content: () => <AvatarChangeForm />,
	},
	{
		key: "location",
		title: "Location",
		description: "Set your home location",
		icon: IconLocation,
		content: () => <SetupUserLocationForm />,
	},
	{
		key: "disciplines",
		title: "Disciplines",
		description: "Set your disciplines",
		icon: IconFireFill,
		content: () => <SetUserDisciplines />,
	},
	{
		key: "aboutMe",
		title: "About You",
		description:
			"Let’s write a small introduction about yourself which other users can see on your profile.",
		icon: Icon108Bubble,
		content: () => <SetupAboutMeText />,
	},
	{
		key: "finalize",
		title: "Success!",
		icon: IconTickCircle,
		iconClassName: "text-emerald-400",
		content: FinalStep,
	},
]
