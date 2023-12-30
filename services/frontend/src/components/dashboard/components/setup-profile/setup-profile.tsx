import { Button } from "@/src/components/button/button"
import { Panel } from "@/src/components/dashboard/components/panel/panel"
import { SetupProfileDialog } from "@/src/components/dashboard/components/setup-profile/setup-profile-dialog"
import { IconBxChevronRight } from "@/src/components/icons/bx-chevron-right"
import IconWavingHand from "@/src/components/icons/waving-hand"
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
					<Panel.Header Icon={IconWavingHand}>
						Welcome, {profileData.username}!
					</Panel.Header>

					<Panel.Body>
						<p className={"text-neutral-50 opacity-60"}>
							Nice to see you! It looks like it’s your first time
							here. To get you started we need to setup your
							profile first. This will only take {stepsLength}{" "}
							{stepsLength !== 1 ? "steps" : "last step"}.
						</p>
					</Panel.Body>

					<Panel.Footer>
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
					</Panel.Footer>
				</Panel>
			)}
		</>
	)
}
