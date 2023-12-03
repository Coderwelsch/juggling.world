import { Button } from "@/src/components/button/button"
import { Panel } from "@/src/components/dashboard/components/panel/panel"
import IconAddCircle from "@/src/components/icons/add-circle"
import IconTeamwork from "@/src/components/icons/teamwork"

export const CreateAGroup = () => {
	return (
		<Panel className={"relative"}>
			<Panel.Header Icon={IconTeamwork}>Create a group</Panel.Header>

			<Panel.Body>
				<p className={"opacity-60"}>
					Create or join an already existing juggling group. Groups
					are great ways for you and your friends to get notified when
					someone is going to juggle.
				</p>
			</Panel.Body>

			<Panel.Footer>
				<Button
					IconAfter={
						<IconAddCircle
							width={"100%"}
							height={"100%"}
						/>
					}
				>
					Create a group
				</Button>
			</Panel.Footer>
		</Panel>
	)
}
