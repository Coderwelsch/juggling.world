import { Button } from "@/src/components/button/button"
import { Headline } from "@/src/components/headline/headline"
import IconTickCircle from "@/src/components/icons/tick-circle"
import { useRouter } from "next/router"

export default function Success() {
	const router = useRouter()
	const email = router.query.email

	return (
		<>
			<section
				className={
					"flex h-screen w-screen flex-col items-center justify-center gap-6 p-12"
				}
			>
				<div
					className={
						"flex flex-col items-center justify-center gap-4"
					}
				>
					<IconTickCircle className={"h-20 w-20 text-green-500"} />

					<Headline
						size={2}
						renderAs={"h1"}
						className={"text-space-50"}
					>
						Registered successfully!
					</Headline>

					<p
						className={
							"max-w-md text-center text-space-100 text-opacity-75"
						}
					>
						Please check your email{" "}
						<span className={"font-semibold"}>{email}</span> for a
						confirmation link to activate your account.
					</p>
				</div>

				<Button
					href={"/signin"}
					intent={"primary"}
					className={"mt-4"}
					size={"sm"}
				>
					Go to sign in
				</Button>
			</section>
		</>
	)
}
