import { auth, UserSessionData } from "@/pages/api/auth/[...nextauth]"
import { Breadcrum } from "@/src/components/breadcrum/breadcrum"
import { Button } from "@/src/components/button/button"
import { Panel } from "@/src/components/dashboard/components/panel/panel"
import { useUserSession } from "@/src/components/dashboard/hooks/use-user-session"
import { DashboardLayout } from "@/src/components/dashboard/layout"
import Dialog from "@/src/components/dialog/dialog"
import { Form } from "@/src/components/form/form"
import { FormField } from "@/src/components/form/form-field/form-field"
import { Headline } from "@/src/components/headline/headline"
import { IconBxChevronRight } from "@/src/components/icons/bx-chevron-right"
import { UserSessionProvider } from "@/src/contexts/user-context"
import { queryMe, UserMeData } from "@/src/queries/protected/user/me"
import { GetServerSidePropsContext } from "next"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

export async function getServerSideProps(
	context: GetServerSidePropsContext,
): Promise<
	| {
			props: {
				userData: UserMeData
			}
	  }
	| {
			redirect: {
				destination: string
				permanent: boolean
			}
	  }
> {
	const session = await auth(context.req, context.res)

	if (!session) {
		return {
			redirect: {
				destination: "/signin",
				permanent: false,
			},
		}
	}

	const userData = await queryMe(session.user.id)

	return {
		props: {
			userData,
		},
	}
}

interface DashboardProps {
	userData: UserMeData
}

export default function Dashboard({ userData }: DashboardProps) {
	const user = useUserSession()
	const [setupDialogVisible, setSetupDialogVisible] = useState(false)

	const form = useForm<{
		avatar: File | null
	}>({
		defaultValues: {
			avatar: null,
		},
	})

	const handleSubmit = form.handleSubmit((data) => {
		const formData = new FormData()

		if (!user) {
			console.error("No user session")
			return
		}

		if (data.avatar) {
			formData.append("avatar", data.avatar)
		}

		fetch(`http://cms.localhost/api/users/updateMe`, {
			method: "PUT",
			body: JSON.stringify({
				aboutMe: "Hello, World!",
			}),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.jwt}`,
			},
		})
			.then((res) => {
				return res.json()
			})
			.then((res) => {
				console.log("res", res)
			})
			.catch((err) => {
				console.error(err)
			})
	})

	return (
		<UserSessionProvider value={userData}>
			<DashboardLayout>
				<Dialog
					isVisible={setupDialogVisible}
					onClose={() => setSetupDialogVisible(false)}
				>
					<Dialog.Header title={"Setup your profile"}>
						<Breadcrum>
							<Breadcrum.Item active>Avatar</Breadcrum.Item>
							<Breadcrum.Item>Base Location</Breadcrum.Item>
							<Breadcrum.Item>Contact Data</Breadcrum.Item>
							<Breadcrum.Item>Finish</Breadcrum.Item>
						</Breadcrum>
					</Dialog.Header>

					<Dialog.Body>
						<p className={"text-indigo-50"}>Hello, World!</p>
						<Form
							method={"POST"}
							onSubmit={handleSubmit}
						>
							<FormField>
								<Controller
									render={({
										field: { value, ...field },
									}) => <FormField.FileField {...field} />}
									name={"avatar"}
									control={form.control}
								/>
							</FormField>

							<div className={"flex flex-row gap-4"}>
								<Button type={"submit"}>Upload</Button>

								<Button
									type={"button"}
									variant={"text"}
								>
									Skip
								</Button>
							</div>
						</Form>
					</Dialog.Body>
				</Dialog>

				{userData.attributes.finishedSetup !== true && (
					<Panel className={"text-space-50"}>
						<Headline>
							👋 Welcome, {userData.attributes.username}!
						</Headline>

						<p className={"leading-6 text-space-100"}>
							Nice to see you! It looks like it’s your first time
							here. To get you started we need to setup some
							information about your profile now
						</p>

						<div className={"flex items-center justify-center"}>
							<Button
								intent={"primary"}
								size={"md"}
								IconAfter={
									<IconBxChevronRight className={"h-6 w-6"} />
								}
								onClick={() => {
									setSetupDialogVisible(true)
								}}
							>
								Setup now
							</Button>
						</div>
					</Panel>
				)}
			</DashboardLayout>
		</UserSessionProvider>
	)
}
