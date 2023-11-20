import { Button } from "@/src/components/button/button"
import { useUserSession } from "@/src/components/dashboard/hooks/use-user-session"
import Dialog from "@/src/components/dialog/dialog"
import { Form } from "@/src/components/form/form"
import { FormField } from "@/src/components/form/form-field/form-field"
import { IconBxChevronRight } from "@/src/components/icons/bx-chevron-right"
import ChevronRight from "@/src/components/icons/chevron-right"
import IconUserLarge from "@/src/components/icons/user-large"
import { useWizardContext } from "@/src/components/wizard/wizard"
import { useUpdateAvatar } from "@/src/hooks/data/user/use-update-avatar"
import { getStrapiUrl } from "@/src/lib/get-strapi-url"
import Image from "next/image"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

export const AvatarChangeForm = () => {
	const user = useUserSession()
	const avatar = user?.data.avatar?.data?.attributes?.url

	const wizardContext = useWizardContext()

	const form = useForm<{
		files: File | null
	}>({
		defaultValues: {
			files: null,
		},
	})

	const [previewUrl, setPreviewUrl] = useState<string | undefined>()
	const updateAvatar = useUpdateAvatar()

	const handleSubmit = form.handleSubmit((data, event) => {
		if (!user) {
			console.error("No user session")
			return
		}

		const formData = new FormData(event?.target)

		updateAvatar.mutate(formData)
	})

	const { isDirty, isValid } = form.formState

	return (
		<>
			<Dialog.Body>
				<Form
					method={"POST"}
					onSubmit={handleSubmit}
					className={"flex flex-col items-center gap-4"}
				>
					<div
						className={
							"flex aspect-square w-36 items-center justify-center overflow-hidden rounded-full border border-space-50/20 bg-space-50/10"
						}
					>
						{previewUrl || avatar ? (
							<Image
								width={128}
								height={128}
								src={previewUrl || getStrapiUrl(avatar!)}
								alt={"Your avatar"}
								className={"h-full w-full object-cover"}
							/>
						) : (
							<IconUserLarge
								className={
									"h-5/6 w-5/6 self-end text-space-100/80"
								}
							/>
						)}
					</div>

					{updateAvatar.isSuccess ? (
						<p className={"text-space-50"}>
							Your avatar has been updated.
						</p>
					) : (
						<FormField>
							<Controller
								render={({ field: { value, ...field } }) => (
									<FormField.FileField
										{...field}
										id={"avatar"}
										onChange={(e) => {
											if (!e.target.files?.length) {
												return
											}

											field.onChange(e)
											setPreviewUrl(
												URL.createObjectURL(
													e.target.files?.[0],
												),
											)
										}}
										className={"text-space-50"}
										accept={"image/*"}
									/>
								)}
								name={"files"}
								control={form.control}
							/>
						</FormField>
					)}
				</Form>
			</Dialog.Body>

			<div className={"flex flex-row gap-4"}>
				{wizardContext.hasPreviousStep && (
					<Button
						type={"button"}
						variant={"text"}
						onClick={() => wizardContext.previousStep?.()}
					>
						Previous
					</Button>
				)}

				<Button
					type={"button"}
					variant={"text"}
					disabled={updateAvatar.isSuccess}
					onClick={() => wizardContext.nextStep?.()}
				>
					Skip
				</Button>

				{updateAvatar.isSuccess ? (
					<Button
						type={"submit"}
						IconAfter={<ChevronRight />}
						onClick={() => wizardContext.nextStep?.()}
					>
						Next
					</Button>
				) : (
					<Button
						type={"submit"}
						disabled={
							updateAvatar.isLoading || !isDirty || !isValid
						}
						IconAfter={<IconBxChevronRight />}
						intent={updateAvatar.isSuccess ? "success" : "primary"}
						loading={updateAvatar.isLoading}
					>
						Next
					</Button>
				)}
			</div>
		</>
	)
}
