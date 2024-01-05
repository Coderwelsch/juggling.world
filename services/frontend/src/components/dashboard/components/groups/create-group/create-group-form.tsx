import { Button } from "@/src/components/button/button"
import { Form } from "@/src/components/form/form"
import { FormField } from "@/src/components/form/form-field/form-field"
import {
	CreateGroupInput,
	useCreateGroup,
} from "@/src/hooks/data/user/use-create-group"
import { Controller, useForm } from "react-hook-form"

export const CreateGroupForm = () => {
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
