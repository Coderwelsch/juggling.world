import { Button } from "@/src/components/button/button"
import { Form } from "@/src/components/form/form"
import { FormField } from "@/src/components/form/form-field/form-field"
import { Headline } from "@/src/components/headline/headline"
import { IconBxChevronRight } from "@/src/components/icons/bx-chevron-right"
import { LogoSmall } from "@/src/components/logo/logo-small"
import {
	signInUserQuery,
	UserSignInMutationInput,
	UserSignInMutationResponse,
} from "@/src/queries/sign-in-user"
import { useMutation } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { getCsrfToken, signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"

const signInInputSchema = z.object({
	identifier: z.string(),
	password: z.string().min(8),
})

type SignInInput = z.infer<typeof signInInputSchema>

const DEFAULT_REGISTRATION_INPUT: SignInInput = {
	identifier: "bugmenot@coderwelsch.com",
	password: "Test1234",
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	return {
		props: {
			csrfToken: (await getCsrfToken(context)) || null,
		},
	}
}

export default function Signin({
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	// const session = useSession()

	// if (session.status === "authenticated") {
	// 	redirect("/dashboard")
	// }

	const { handleSubmit, control, formState } = useForm<SignInInput>({
		mode: "onChange",
		defaultValues: DEFAULT_REGISTRATION_INPUT,
		resolver: zodResolver(signInInputSchema),
	})

	const router = useRouter()

	const [signInUser, signInState] = useMutation<
		UserSignInMutationResponse,
		{ input: UserSignInMutationInput }
	>(signInUserQuery, {
		variables: {
			input: {
				identifier: "",
				password: "",
			},
		},
	})

	const onSubmit: SubmitHandler<SignInInput> = (data) => {
		signIn(
			"credentials",
			{
				callbackUrl: "/dashboard",
			},
			{
				identifier: data.identifier,
				password: data.password,
				csrfToken: csrfToken || "",
			},
		).catch((error) => {
			console.error(error)
		})
	}

	useEffect(() => {
		if (!signInState.data) {
			return
		}

		const searchParams = new URLSearchParams({
			email: signInState.data?.login.user.email,
		})

		const timeout = setTimeout(() => {
			router.push(`success?${searchParams.toString()}`)
		}, 3000)

		return () => {
			clearTimeout(timeout)
		}
	}, [signInState, router])

	return (
		<>
			<section
				className={
					"flex min-h-screen w-screen flex-col items-center justify-center gap-6 p-12"
				}
			>
				<div
					className={
						"flex flex-col items-center justify-center gap-2"
					}
				>
					<LogoSmall />

					<Headline
						size={2}
						renderAs={"h1"}
						className={"text-slate-50"}
					>
						Sign in
					</Headline>
				</div>

				{signInState.error && (
					<p className={"max-w-md text-center text-red-500"}>
						{signInState.error.message}
					</p>
				)}

				<div
					className={
						"w-full max-w-sm rounded-xl border border-slate-50/10 bg-slate-900 text-white"
					}
				>
					<Form className={"overflow-hidden rounded-lg"}>
						<div className={"flex flex-col gap-4 px-8 pb-4 pt-8"}>
							<input
								name="csrfToken"
								type="hidden"
								defaultValue={csrfToken || ""}
							/>

							<FormField>
								<FormField.Label>
									E-Mail or Password
								</FormField.Label>

								<Controller
									render={({ field }) => (
										<FormField.InputField
											type={"email"}
											placeholder={"your@email.com"}
											name={"identifier"}
											value={field.value}
											onChange={field.onChange}
										/>
									)}
									name="identifier"
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
						</div>

						<Button
							rounded={false}
							type={"submit"}
							size={"md"}
							loading={signInState.loading}
							disabled={signInState.loading || !formState.isValid}
							error={Boolean(signInState.error)}
							success={Boolean(signInState.data)}
							onClick={handleSubmit(onSubmit)}
							IconAfter={
								<IconBxChevronRight
									className={"h-full w-full"}
								/>
							}
						>
							{signInState.data ? "Signed in …" : "Sign In"}
						</Button>
					</Form>
				</div>
			</section>
		</>
	)
}
