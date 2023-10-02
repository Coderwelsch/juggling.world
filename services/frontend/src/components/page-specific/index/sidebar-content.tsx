import { Headline } from "@/src/components/headline/headline"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { DisciplinesContext } from "@/src/contexts/disciplines-context"
import { classNames } from "@/src/lib/class-names"
import { playerInfoQuery, PlayerResponse } from "@/src/queries/player-info"
import { useQuery } from "@apollo/client"
import Image from "next/image"
import * as React from "react"

export const SidebarPlayerContent = ({ playerId }: { playerId: string }) => {
	const { data, loading } = useQuery<PlayerResponse>(playerInfoQuery, {
		skip: !playerId,
		variables: {
			id: playerId,
		},
	})

	const player = data?.player.data
	const disciplines = player?.attributes?.disciplines?.data || []

	const playerDisciplines = disciplines.map((d) => {
		return disciplines.find((discipline) => discipline.id === d.id)
	})

	const avatarUrl = player?.attributes.avatar?.data.attributes.url

	return (
		<>
			<LoaderOverlay shown={loading} />

			{player && (
				<div className={"flex w-full flex-col gap-4"}>
					<div className={"flex flex-row items-center gap-4"}>
						{avatarUrl && (
							<img
								src={`http://cms.localhost${avatarUrl}`}
								alt={""}
								className={
									"h-20 w-20 rounded-full border border-fuchsia-300"
								}
							/>
						)}

						<div className={"flex flex-col gap-0"}>
							<Headline
								size={3}
								className={"leading-6"}
							>
								{player.attributes.username}
							</Headline>

							{player.attributes.city && (
								<p className={"text-sm text-fuchsia-500"}>
									{player.attributes.city}
								</p>
							)}
						</div>
					</div>

					<div className={"h-px w-full bg-fuchsia-200"} />

					<div className={"flex flex-col gap-6"}>
						<div className={"flex flex-col gap-2"}>
							<Headline size={6}>Plays:</Headline>

							<div className={"flex flex-row items-center gap-4"}>
								{disciplines.map((discipline) => {
									const icon =
										discipline.attributes.discipline.data
											.attributes.icon?.data.attributes
											.url

									return (
										<div
											key={discipline.id}
											className={classNames(
												"inline-flex flex-row items-center gap-2 bg-fuchsia-500 bg-opacity-5 p-1 pr-4 rounded-full",
											)}
										>
											{icon && (
												<div
													className={
														"flex h-8 w-8 items-center justify-center rounded-full border border-fuchsia-300 bg-fuchsia-200"
													}
												>
													<Image
														className={classNames(
															"h-5 w-5",
														)}
														alt={""}
														width={32}
														height={32}
														src={`http://strapi${icon}`}
													/>
												</div>
											)}

											<Headline size={5}>
												{
													discipline.attributes
														.discipline.data
														.attributes.name
												}

												{discipline.attributes
													.startedAt && (
													<span
														className={"text-sm"}
													></span>
												)}
											</Headline>
										</div>
									)
								})}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
