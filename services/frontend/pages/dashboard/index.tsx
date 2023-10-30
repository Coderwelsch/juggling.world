import { Headline } from "@/src/components/headline/headline"

export default function Dashboard() {
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
					<Headline
						size={1}
						className={"text-space-50"}
					>
						Dashboard
					</Headline>

					<p
						className={
							"max-w-md text-center text-space-100 text-opacity-75"
						}
					>
						Welcome to your dashboard!
					</p>
				</div>
			</section>
		</>
	)
}
