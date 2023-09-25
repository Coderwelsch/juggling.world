import { Button } from "@/src/components/button/button"
import { Form } from "@/src/components/form/form"
import { FormField } from "@/src/components/form/form-field/form-field"
import { Headline } from "@/src/components/headline/headline"
import { useRegisterUser } from "@/src/hooks/data/register-user"
import { Controller, SubmitHandler, useForm } from "react-hook-form"

import LOGO from "@/src/assets/logo/minimal.svg"

type RegistrationInput = {
	email: string
	username: string
	password: string
	passwordConfirmation: string
}

export default function Register() {
	const { handleSubmit, control, formState } = useForm<RegistrationInput>({
		mode: "onChange",
		defaultValues: {
			email: "",
			username: "",
			password: "",
			passwordConfirmation: "",
		},
	})

	const registerUser = useRegisterUser()

	const onSubmit: SubmitHandler<RegistrationInput> = (data) => {
		console.log(data)
	}

	return (
		<section
			className={
				"flex h-screen w-screen flex-col items-center justify-center gap-6 bg-space-950"
			}
		>
			<div className={"flex flex-col items-center justify-center gap-2"}>
				<img
					className={"w-20"}
					src={LOGO.src}
					alt=""
				/>

				<Headline
					size={1}
					className={"text-space-50"}
				>
					Registration
				</Headline>

				<p className={"max-w-sm text-center text-space-50"}>
					Create an account to find other diabolo players around the
					globe … or next door!
				</p>
			</div>

			<div
				className={
					"w-full max-w-sm overflow-hidden rounded-xl border border-space-300 border-opacity-30 bg-space-900"
				}
			>
				<Form onSubmit={handleSubmit(onSubmit)}>
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
										placeholder={"Password Confirmation"}
										value={field.value}
										onChange={field.onChange}
									/>
								)}
								name="password"
								control={control}
							/>
						</FormField>
					</div>

					<Button
						type={"submit"}
						rounded={false}
						onSubmit={handleSubmit(onSubmit)}
						disabled={registerUser.isLoading || !formState.isValid}
					>
						{registerUser.isSuccess ? "Success" : "Register"}
					</Button>
				</Form>
			</div>
		</section>
	)
}
