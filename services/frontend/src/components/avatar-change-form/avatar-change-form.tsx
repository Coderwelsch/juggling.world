import { Button } from "@/src/components/button/button"
import Dialog from "@/src/components/dialog/dialog"
import { Form } from "@/src/components/form/form"
import { FormField } from "@/src/components/form/form-field/form-field"
import { Headline } from "@/src/components/headline/headline"
import ChevronRight from "@/src/components/icons/chevron-right"
import IconUpload from "@/src/components/icons/upload"
import IconUserLarge from "@/src/components/icons/user-large"
import { useWizardContext } from "@/src/components/wizard/wizard"
import { useUserProfileContext } from "@/src/hooks/data/user/use-profile-data"
import { useUpdateAvatar } from "@/src/hooks/data/user/use-update-avatar"
import { classNames } from "@/src/lib/class-names"
import { getStrapiUrl } from "@/src/lib/get-strapi-url"
import Image from "next/image"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

export const AvatarChangeForm = () => {
	const user = useUserProfileContext()
	const avatar = user?.avatar?.url

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

		if (!event?.target?.files) {
			console.error("No files")
			return
		}

		const formData = new FormData(event?.target)

		updateAvatar.mutate(formData)
	})

	const { isDirty, isValid } = form.formState

	return (
		<>
			<Form
				method={"POST"}
				onSubmit={handleSubmit}
				className={
					"flex w-full flex-col items-center justify-center gap-6"
				}
			>
				<Dialog.Body
					className={
						"flex flex-row items-center justify-center gap-4 p-0"
					}
				>
					<div className="flex flex-col items-center justify-center gap-2 border-r border-slate-100/20 p-6">
						<div
							className={classNames(
								"flex aspect-square w-36 items-center justify-center",
								"overflow-hidden rounded-full border border-slate-50/10 bg-slate-50/10",
							)}
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
										"h-5/6 w-5/6 self-end text-slate-100/80"
									}
								/>
							)}
						</div>

						<FormField className={"w-full"}>
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
										className={"text-slate-50"}
										accept={"image/*"}
									/>
								)}
								name={"files"}
								control={form.control}
							/>
						</FormField>
					</div>

					<div
						className={
							"flex w-1/2 shrink-0 flex-col gap-2 self-start px-4 py-6 text-slate-50"
						}
					>
						<Headline size={4}>Avatar</Headline>

						{updateAvatar.isSuccess ? (
							<p className={"text-emerald-500"}>
								Your avatar has been uploaded.
							</p>
						) : (
							<p className={"text-sm text-slate-50/60"}>
								Please upload your avatar image here. Please
								note that you need to upload a square image.
								Only upload files and images you own!
							</p>
						)}
					</div>
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
							onClick={() => {
								if (!avatar) {
									setPreviewUrl(getStrapiUrl(avatar!))
									form.reset()
								}

								wizardContext.nextStep?.()
							}}
						>
							Next
						</Button>
					) : (
						<Button
							type={"submit"}
							disabled={
								updateAvatar.isLoading || !isDirty || !isValid
							}
							IconAfter={<IconUpload />}
							onClick={() => handleSubmit()}
							intent={
								updateAvatar.isSuccess ? "success" : "primary"
							}
							loading={updateAvatar.isLoading}
						>
							Upload
						</Button>
					)}
				</div>
			</Form>
		</>
	)
}
