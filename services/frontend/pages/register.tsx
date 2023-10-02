import { Button } from "@/src/components/button/button"
import { Form } from "@/src/components/form/form"
import { FormField } from "@/src/components/form/form-field/form-field"
import { Headline } from "@/src/components/headline/headline"
import { LogoSmall } from "@/src/components/logo/logo-small"
import { LandingPageNav } from "@/src/components/nav/landing-page-nav"
import {
	createUserQuery,
	UserCreationMutationInput,
	UserCreationMutationResponse,
} from "@/src/queries/register-user"
import { useMutation } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

const registrationInputSchema = z.object({
	email: z.string().email(),
	username: z.string().min(3),
	password: z.string().min(8),
	passwordConfirmation: z.string().min(8),
})

type RegistrationInput = z.infer<typeof registrationInputSchema>

const DEFAULT_REGISTRATION_INPUT: RegistrationInput = {
	email: "",
	username: "",
	password: "",
	passwordConfirmation: "",
}

export default function Register() {
	const { handleSubmit, control, formState } = useForm<RegistrationInput>({
		mode: "onChange",
		defaultValues: DEFAULT_REGISTRATION_INPUT,
		resolver: zodResolver(registrationInputSchema),
	})

	const [registerUser, registerState] = useMutation<
		UserCreationMutationResponse,
		{ input: UserCreationMutationInput }
	>(createUserQuery, {
		variables: {
			input: {
				email: "",
				username: "",
				password: "",
			},
		},
	})

	const onSubmit: SubmitHandler<RegistrationInput> = (data) => {
		registerUser({
			variables: {
				input: {
					email: data.email,
					username: data.username,
					password: data.password,
				},
			},
		}).catch((error) => {
			console.error(error)
		})
	}

	console.log("registerUser", registerState)
	console.log("formState", formState)

	return (
		<>
			<LandingPageNav />

			<section
				className={
					"flex h-full w-full flex-col items-center justify-center gap-6 p-12"
				}
			>
				<div
					className={
						"flex flex-col items-center justify-center gap-2"
					}
				>
					<LogoSmall />

					<Headline
						size={1}
						className={"text-space-50"}
					>
						Registration
					</Headline>

					<p className={"max-w-sm text-center text-space-50"}>
						Create an account to find other diabolo players around
						the globe … or next door!
					</p>
				</div>

				<div
					className={
						"w-full max-w-sm rounded-xl border border-space-300 border-opacity-30 bg-space-900 text-white"
					}
				>
					<Form
						onSubmit={handleSubmit(onSubmit)}
						className={"overflow-hidden rounded-lg"}
					>
						<div className={"flex flex-col gap-4 px-8 pb-4 pt-8"}>
							<FormField>
								<FormField.Label>E-Mail</FormField.Label>

								<Controller
									render={({ field }) => (
										<FormField.InputField
											type={"email"}
											placeholder={"your@email.com"}
											name={"email"}
											value={field.value}
											onChange={field.onChange}
										/>
									)}
									name="email"
									control={control}
								/>
							</FormField>

							<FormField>
								<FormField.Label>Username</FormField.Label>

								<Controller
									render={({ field }) => (
										<FormField.InputField
											type={"text"}
											name={"username"}
											placeholder={"Username"}
											value={field.value}
											onChange={field.onChange}
										/>
									)}
									name="username"
									control={control}
								/>
							</FormField>

							<FormField>
								<FormField.Label>Password</FormField.Label>

								<Controller
									render={({ field }) => (
										<FormField.InputField
											type={"password"}
											name={"password"}
											placeholder={"Password"}
											value={field.value}
											onChange={field.onChange}
										/>
									)}
									name="password"
									control={control}
								/>
							</FormField>

							<FormField>
								<FormField.Label>Confirm</FormField.Label>

								<Controller
									render={({ field }) => (
										<FormField.InputField
											type={"text"}
											name={"passwordConfirmation"}
											placeholder={
												"Password Confirmation"
											}
											value={field.value}
											onChange={field.onChange}
										/>
									)}
									name="passwordConfirmation"
									control={control}
								/>
							</FormField>
						</div>

						<Button
							rounded={false}
							type={"submit"}
							disabled={
								registerState.loading || !formState.isValid
							}
							error={Boolean(registerState.error)}
							success={Boolean(registerState.data)}
						>
							Register
						</Button>
					</Form>
				</div>
			</section>
		</>
	)
}
