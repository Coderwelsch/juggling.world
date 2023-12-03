import { Panel } from "@/src/components/dashboard/components/panel/panel"
import { Headline } from "@/src/components/headline/headline"

export const CreateAGroup = () => {
	return (
		<Panel>
			<Headline>Create your first group 🙏</Headline>

			<p className={"opacity-60"}>
				Create a juggling group for you and your friends to get notified
				when someone is going to juggle.
			</p>
		</Panel>
	)
}
