import { Button } from "@/src/components/button/button"
import { Headline } from "@/src/components/headline/headline"
import IconTickCircle from "@/src/components/icons/tick-circle"
import { useRouter } from "next/router"

export default function EmailVerified() {
	const router = useRouter()

	return (
		<>
			<section
				className={
					"flex h-screen w-screen flex-col items-center justify-center gap-2 p-12"
				}
			>
				<div
					className={
						"flex max-w-lg flex-col items-center justify-center gap-4"
					}
				>
					<IconTickCircle className={"h-20 w-20 text-green-500"} />

					<Headline
						size={2}
						renderAs={"h1"}
						className={"text-center text-space-50"}
					>
						Email verified successfully!
					</Headline>

					<p
						className={
							"max-w-md text-center text-space-100 text-opacity-75"
						}
					>
						You’re now ready to sign in! Happy juggling!
					</p>
				</div>

				<Button
					href={"/signin"}
					intent={"primary"}
					className={"mt-4"}
					size={"sm"}
				>
					Sign in
				</Button>
			</section>
		</>
	)
}
