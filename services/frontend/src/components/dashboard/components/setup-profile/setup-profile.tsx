import { Button } from "@/src/components/button/button"
import { Panel } from "@/src/components/dashboard/components/panel/panel"
import { SetupProfileDialog } from "@/src/components/dashboard/components/setup-profile/setup-profile-dialog"
import { Headline } from "@/src/components/headline/headline"
import { IconBxChevronRight } from "@/src/components/icons/bx-chevron-right"
import { useUserProfileContext } from "@/src/hooks/data/user/use-profile-data"
import { useUserNeedsSetup } from "@/src/hooks/data/user/use-user-needs-setup"
import { useState } from "react"

export const SetupProfileSection = () => {
	const profileData = useUserProfileContext()
	const userNeedsSetup = useUserNeedsSetup()
	const [setupDialogVisible, setSetupDialogVisible] = useState(false)

	const handleOnClose = () => {
		setSetupDialogVisible(false)
	}

	if (!profileData) {
		return null
	}

	const stepsLength = Object.values(userNeedsSetup?.checks || {}).filter(
		(value) => !value,
	).length

	return (
		<>
			<SetupProfileDialog
				isVisible={setupDialogVisible}
				onClose={handleOnClose}
			/>

			{!userNeedsSetup?.hasFinishedSetup && (
				<Panel>
					<Headline>Welcome 👋, {profileData.username}!</Headline>

					<p className={"text-slate-50 opacity-60"}>
						Nice to see you! It looks like it’s your first time
						here. To get you started we need to setup your profile
						first. This will only take {stepsLength}{" "}
						{stepsLength !== 1 ? "steps" : "last step"}.
					</p>

					<div className={"flex items-center justify-center"}>
						<Button
							intent={"primary"}
							size={"sm"}
							IconAfter={
								<IconBxChevronRight
									className={"h-full w-full"}
								/>
							}
							onClick={() => {
								setSetupDialogVisible(true)
							}}
						>
							Setup now
						</Button>
					</div>
				</Panel>
			)}
		</>
	)
}
