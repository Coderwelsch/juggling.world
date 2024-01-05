import { LandingPageNav } from "@/src/components/nav/landing-page-nav"

const AboutPage = () => {
	return (
		<>
			<LandingPageNav />

			<main className={"mx-auto max-w-5xl px-4 pt-24"}>
				<h1 className={"text-3xl font-semibold"}>About</h1>
			</main>
		</>
	)
}

export default AboutPage
