import { Avatar } from "@/src/components/avatar/avatar"
import { Button } from "@/src/components/button/button"
import Dialog from "@/src/components/dialog/dialog"
import { Headline } from "@/src/components/headline/headline"
import IconChevronRight from "@/src/components/icons/chevron-right"
import { useWizardContext } from "@/src/components/wizard/wizard"
import { useUserProfileContext } from "@/src/hooks/data/user/use-profile-data"
import { useUpdateProfileMutation } from "@/src/hooks/data/user/use-update-profile"
import { Controller, useForm } from "react-hook-form"

export const SetupAboutMeText = () => {
	const user = useUserProfileContext()
	const wizardContext = useWizardContext()

	const defaultText = `Hey, I’m ${user?.username}! I’m playing ${user?.disciplines
		.map((discipline) => discipline.discipline?.name)
		.join(", ")}. Let’s connect!`

	const form = useForm({
		defaultValues: {
			aboutMe: "",
		},
	})

	const updateUser = useUpdateProfileMutation()

	const handleSubmit = form.handleSubmit(async (data) => {
		await updateUser.mutateAsync(
			JSON.stringify({
				aboutMe: data.aboutMe,
			}),
		)

		wizardContext.nextStep?.()
	})

	return (
		<>
			<Dialog.Body
				className={
					"flex max-w-xl flex-col items-center gap-3 overflow-y-scroll p-6"
				}
			>
				<div className={"w-36"}>
					{user?.avatar?.url ? (
						<Avatar src={user?.avatar?.url} />
					) : null}
				</div>

				<Headline
					size={3}
					className={"text-center"}
				>
					{user?.username}
				</Headline>

				<Controller
					render={({ field }) => (
						<textarea
							className={
								"min-h-[8rem] w-4/5 rounded-lg bg-neutral-50/5 p-4 text-sm placeholder:text-neutral-50/60 hover:bg-neutral-50/10"
							}
							placeholder={defaultText}
							maxLength={200}
							{...field}
						/>
					)}
					name={"aboutMe"}
					control={form.control}
				/>
			</Dialog.Body>

			<Button
				onClick={handleSubmit}
				disabled={!form.formState.isDirty}
				IconAfter={<IconChevronRight />}
			>
				Next
			</Button>
		</>
	)
}
