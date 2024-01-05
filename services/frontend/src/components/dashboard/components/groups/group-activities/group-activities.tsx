import { AvatarTag } from "@/src/components/avatar-tag/avatar-tag"
import { Avatar } from "@/src/components/avatar/avatar"
import { Button } from "@/src/components/button/button"
import { CreateGroupForm } from "@/src/components/dashboard/components/groups/create-group/create-group-form"
import { Panel } from "@/src/components/dashboard/components/panel/panel"
import Dialog from "@/src/components/dialog/dialog"
import { SelectLocationField } from "@/src/components/form/form-field/select-location-field/select-location-field"
import { Headline } from "@/src/components/headline/headline"
import IconAddCircle from "@/src/components/icons/add-circle"
import IconTeamwork from "@/src/components/icons/teamwork"
import { useGetOwnGroups } from "@/src/hooks/data/user/use-get-own-groups"
import { classNames } from "@/src/lib/class-names"
import { truncateString } from "@/src/lib/truncate-string"
import { Group, GroupEvent } from "@/src/types/cms/api"
import { useMemo, useState } from "react"

interface CreateGroupEventProps {
	isVisible: boolean
	onClose: () => void
}

const CreateGroupEvent = ({ isVisible, onClose }: CreateGroupEventProps) => {
	return (
		<Dialog
			isVisible={isVisible}
			onClose={onClose}
		>
			<Dialog.Header title={"Create an event"} />

			<Dialog.Body>
				<CreateGroupForm />
			</Dialog.Body>
		</Dialog>
	)
}

interface GroupPanelProps extends Group {}

const GroupPanel = ({
	id,
	avatar,
	location,
	events,
	members,
	admins,
	name,
	description,
	isAdmin,
	isPrivate,
}: GroupPanelProps) => {
	const [isCreateGroupEventVisible, setIsCreateGroupEventVisible] =
		useState(false)

	const initialSelectedEvent = useMemo(() => {
		if (events.length === 0) {
			return null
		}

		return events[0]
	}, [events])

	const [selectedEvent, setSelectedEvent] = useState<null | GroupEvent>(
		initialSelectedEvent || null,
	)

	return (
		<Panel
			key={id}
			className={"relative"}
		>
			<CreateGroupEvent
				isVisible={isCreateGroupEventVisible}
				onClose={() => setIsCreateGroupEventVisible(false)}
			/>

			<Panel.Header
				className={"flex flex-col gap-1 leading-6"}
				Icon={() => {
					if (!avatar?.url) {
						return <IconTeamwork />
					}

					return (
						<Avatar
							src={avatar.url}
							intent={"sun"}
						/>
					)
				}}
			>
				<span>{name}</span>

				<br />

				<span className={"flex flex-row gap-2 text-sm"}>
					{members.slice(0, 3).map((member, index) => {
						const isLast = index === members.slice(0, 3).length - 1

						return (
							<span
								key={member.id}
								className={"flex flex-row"}
							>
								<AvatarTag
									url={member.avatar?.url}
									className={
										"text-xs font-normal text-neutral-50/60"
									}
								>
									{member.username}
								</AvatarTag>

								{/* add colon */}
								{!isLast && (
									<span className={"text-neutral-100/60"}>
										,
									</span>
								)}
							</span>
						)
					})}

					{members.length > 3 && (
						<span className={"text-neutral-100/60"}>
							{` and ${members.length - 3} more`}
						</span>
					)}
				</span>
			</Panel.Header>

			<Panel.Body className={"flex flex-row gap-3 px-0"}>
				<SelectLocationField
					onChange={() => {}}
					onMarkerClick={(map) => {
						if (!selectedEvent) {
							return
						}

						map?.flyTo({
							center: {
								lat: selectedEvent.location.location.latitude,
								lng: selectedEvent.location.location.longitude,
							},
							zoom: Math.max(12, map.getZoom()),
						})
					}}
					location={selectedEvent?.location.location}
					className={
						"aspect-square w-2/3 grow overflow-hidden rounded-lg"
					}
					markerLabel={selectedEvent?.name}
					markerIntent={"sun"}
				></SelectLocationField>

				<div className={"flex w-1/3 shrink-0 flex-col gap-2"}>
					<Headline
						size={5}
						className={"border-b border-neutral-50/10 pb-1.5"}
					>
						Latest events
					</Headline>

					<div className={"h-auto grow overflow-y-auto"}>
						<ul className={"flex flex-col gap-2"}>
							{events.map((event) => {
								const isSelected =
									selectedEvent?.id === event.id

								return (
									<li
										key={event.id}
										onClick={() => setSelectedEvent(event)}
										className={classNames(
											"cursor-pointer rounded-lg border border-neutral-50/0 px-3 py-2 hover:bg-primary-100/20",
											isSelected &&
												"bg-primary-100/20 border-primary-400",
										)}
									>
										<Headline size={6}>
											{event.name}
										</Headline>

										<p
											className={
												"whitespace-nowrap text-xs"
											}
										>
											{truncateString(
												members
													.map((m) => m.username)
													.join(", "),
												32,
											)}
										</p>

										<div
											className={
												"flex items-center gap-1"
											}
										>
											<div
												className={
													"h-2.5 w-2.5 rounded-full bg-mint-600"
												}
											></div>

											<p
												className={
													"text-xs text-neutral-50/60"
												}
											>
												16:00 (in 3h)
											</p>
										</div>
									</li>
								)
							})}
						</ul>
					</div>

					<div
						className={
							"flex items-center justify-center border-t border-neutral-50/10 pt-4"
						}
					>
						<Button
							IconBefore={<IconAddCircle />}
							intent={"sun"}
							size={"sm"}
							onClick={() => setIsCreateGroupEventVisible(true)}
						>
							Create Event
						</Button>
					</div>
				</div>
			</Panel.Body>
		</Panel>
	)
}

interface GroupActivitiesProps {}

export const GroupActivities = (props: GroupActivitiesProps) => {
	const userGroups = useGetOwnGroups()

	return userGroups.data?.map((group) => {
		return (
			<GroupPanel
				key={group.id}
				{...group}
			/>
		)
	})
}
