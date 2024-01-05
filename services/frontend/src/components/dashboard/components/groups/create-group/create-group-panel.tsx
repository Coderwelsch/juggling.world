import { Button } from "@/src/components/button/button"
import { CreateGroupForm } from "@/src/components/dashboard/components/groups/create-group/create-group-form"
import { Panel } from "@/src/components/dashboard/components/panel/panel"
import Dialog from "@/src/components/dialog/dialog"
import IconAddCircle from "@/src/components/icons/add-circle"
import IconSearch from "@/src/components/icons/search"
import IconTeamwork from "@/src/components/icons/teamwork"
import { useState } from "react"

export const CreateGroupPanel = () => {
	const [isCreationDialogOpen, setCreationDialogOpen] = useState(false)

	return (
		<>
			<Dialog
				isVisible={isCreationDialogOpen}
				onClose={() => setCreationDialogOpen(false)}
			>
				<Dialog.Header
					Icon={IconTeamwork}
					title={"Create your first group"}
				>
					<p className={"opacity-60"}>
						Groups are great ways for you and your friends to get
						notified when someone is going to practice somewhere.
					</p>
				</Dialog.Header>

				<Dialog.Body>
					<CreateGroupForm />
				</Dialog.Body>
			</Dialog>

			<Panel className={"relative"}>
				<Panel.Header Icon={IconTeamwork}>
					Create your first group
				</Panel.Header>

				<Panel.Body>
					<p className={"opacity-60"}>
						Groups are a great ways for you and your friends to get
						notified when someone is going to practice somewhere.
					</p>
				</Panel.Body>

				<Panel.Footer>
					<Button
						variant={"text"}
						IconBefore={
							<IconSearch
								width={"100%"}
								height={"100%"}
							/>
						}
					>
						Find a group
					</Button>

					<Button
						onClick={() => setCreationDialogOpen(true)}
						IconBefore={
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
		</>
	)
}
