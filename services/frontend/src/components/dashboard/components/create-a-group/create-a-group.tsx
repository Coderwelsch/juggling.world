import { Button } from "@/src/components/button/button"
import { Panel } from "@/src/components/dashboard/components/panel/panel"
import Dialog from "@/src/components/dialog/dialog"
import { FormField } from "@/src/components/form/form-field/form-field"
import IconAddCircle from "@/src/components/icons/add-circle"
import IconSearch from "@/src/components/icons/search"
import IconTeamwork from "@/src/components/icons/teamwork"
import {
	CreateGroupInput,
	useCreateGroup,
} from "@/src/hooks/data/user/use-create-group"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Form } from "@/src/components/form/form"

const CreateGroupForm = () => {
	const form = useForm<CreateGroupInput>({
		defaultValues: {
			name: "Thorben",
			avatar: null,
			description: "Hello, World!",
			members: [],
			location: {
				latitude: 53,
				longitude: 14,
			},
		},
	})

	const createGroup = useCreateGroup()

	const handleSubmit = form.handleSubmit(async (data, event) => {
		if (!event?.target) {
			return
		}

		const formData = new FormData()

		formData.append(
			"data",
			JSON.stringify({
				name: data.name,
				description: data.description,
				members: data.members,
				location: data.location,
			}),
		)

		const avatar = event.target.avatar?.files?.[0]

		if (avatar) {
			formData.append(`files.${avatar.name}`, avatar, avatar.name)
		}

		createGroup.mutate(formData)
	})

	return (
		<Form onSubmit={handleSubmit}>
			<FormField>
				<FormField.Label>Name</FormField.Label>

				<Controller
					name={"name"}
					control={form.control}
					render={({ field }) => (
						<FormField.InputField
							{...field}
							placeholder={"Juggling group"}
						/>
					)}
				/>
			</FormField>

			<FormField>
				<FormField.Label>Avatar</FormField.Label>

				<Controller
					name={"avatar"}
					control={form.control}
					render={({ field: { value, ...field } }) => (
						<FormField.FileField
							{...field}
							name={"avatar"}
							type={"file"}
							id={"avatar"}
							placeholder={"Juggling group"}
						/>
					)}
				/>
			</FormField>

			<FormField>
				<FormField.Label>Description</FormField.Label>

				<Controller
					name={"description"}
					control={form.control}
					render={({ field }) => (
						<FormField.InputField
							{...field}
							placeholder={"Description"}
						/>
					)}
				/>
			</FormField>

			<FormField>
				<FormField.Label>Location</FormField.Label>

				<Controller
					name={"location.latitude"}
					control={form.control}
					render={({ field }) => (
						<FormField.InputField
							{...field}
							placeholder={"Latitude"}
						/>
					)}
				/>

				<Controller
					name={"location.longitude"}
					control={form.control}
					render={({ field }) => (
						<FormField.InputField
							{...field}
							placeholder={"Latitude"}
						/>
					)}
				/>
			</FormField>

			<Button
				intent={createGroup.isSuccess ? "mint" : "primary"}
				loading={createGroup.isLoading}
				type={"submit"}
			>
				Submit
			</Button>
		</Form>
	)
}

export const CreateAGroup = () => {
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
