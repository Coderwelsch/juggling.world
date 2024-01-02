import { Avatar } from "@/src/components/avatar/avatar"
import { DividerHorizontal } from "@/src/components/divider/divider-horizontal"
import { Headline } from "@/src/components/headline/headline"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { Body } from "@/src/components/sidebar/sidebar"
import { useGetGroup } from "@/src/hooks/data/groups/use-get-group"
import * as React from "react"
import { ReactNode } from "react"
import Markdown from "react-markdown"

interface GroupInfoProps {
	id: number
}

export const GroupInfo = ({ id }: GroupInfoProps) => {
	const group = useGetGroup(id)
	const { members, name, avatar, description } = group.data || {}

	const avatarUrl = avatar?.url

	return (
		<Body>
			<LoaderOverlay shown={!group.data} />

			{group.data && (
				<div className={"flex w-full flex-col gap-5"}>
					<div className={"flex flex-row items-center gap-4"}>
						<Avatar
							src={avatarUrl}
							width={120}
							height={120}
							alt={name || ""}
							className={"h-20 w-20"}
							intent={"sun"}
							iconClassName={"h-12 w-12 fill-neutral-50"}
						/>

						<div>
							<Headline size={3}>{name}</Headline>
							<div className="prose text-xs text-neutral-50 text-opacity-50 prose-a:text-neutral-300 hover:prose-a:text-neutral-400">
								<Markdown>{group.data.description}</Markdown>
							</div>
						</div>
					</div>

					<DividerHorizontal />

					<p>Hello</p>
				</div>
			)}
		</Body>
	)
}
