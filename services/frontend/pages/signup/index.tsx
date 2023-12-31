import { Button } from "@/src/components/button/button"
import { Form } from "@/src/components/form/form"
import { FormField } from "@/src/components/form/form-field/form-field"
import { Headline } from "@/src/components/headline/headline"
import IconAddCircle from "@/src/components/icons/add-circle"
import { LogoSmall } from "@/src/components/logo/logo-small"
import {
	createUserQuery,
	UserCreationMutationInput,
	UserCreationMutationResponse,
} from "@/src/queries/register-user"
import { useMutation } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"
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

	const router = useRouter()

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

	useEffect(() => {
		if (!registerState.data) {
			return
		}

		const searchParams = new URLSearchParams({
			email: registerState.data?.register.user.email,
		})

		const timeout = setTimeout(() => {
			router.push(`./success${searchParams.toString()}`)
		}, 3000)

		return () => {
			clearTimeout(timeout)
		}
	}, [registerState, router])

	return (
		<>
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
					<Link href={"/"}>
						<LogoSmall />
					</Link>

					<Headline
						size={1}
						className={"text-densed-50"}
					>
						Registration
					</Headline>

					<p
						className={
							"max-w-sm text-center text-densed-100 text-opacity-75"
						}
					>
						Create an account to find other jugglers around the
						globe … or next door?!
					</p>
				</div>

				<div
					className={
						"w-full max-w-sm rounded-xl border border-densed-50/10 bg-densed-900 text-neutral-50"
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
							loading={registerState.loading}
							disabled={
								registerState.loading || !formState.isValid
							}
							error={Boolean(registerState.error)}
							success={Boolean(registerState.data)}
						>
							{registerState.data ? "Registered …" : "Register"}
						</Button>
					</Form>
				</div>

				<div className={"flex flex-row items-center justify-center"}>
					<Button
						href={"/signin"}
						variant={"text"}
						intent={"densed"}
					>
						Already have an account?
					</Button>
				</div>
			</section>
		</>
	)
}
