import { Panel } from "@/src/components/dashboard/components/panel/panel"
import { Headline } from "@/src/components/headline/headline"
import IconTeamwork from "@/src/components/icons/teamwork"
import { useGetGroups } from "@/src/hooks/data/user/use-get-groups"

interface GroupActivitiesProps {}

export const GroupActivities = ({}: GroupActivitiesProps) => {
	const userGroups = useGetGroups()

	return (
		<Panel className={"relative"}>
			<Panel.Header Icon={IconTeamwork}>Group Activities</Panel.Header>

			<Panel.Body>
				<ul>
					{userGroups.data?.map((group) => (
						<li
							key={group.id}
							className={"bg-gray-100/5 p-4"}
						>
							<Headline size={4}>
								<a href={`/dashboard/group/${group.id}`}>
									{group.name}
								</a>
							</Headline>
						</li>
					))}
				</ul>
			</Panel.Body>
		</Panel>
	)
}
