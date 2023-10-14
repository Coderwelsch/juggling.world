import { Headline } from "@/src/components/headline/headline"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { classNames } from "@/src/lib/class-names"
import { playerInfoQuery, PlayerResponse } from "@/src/queries/player-info"
import { useQuery } from "@apollo/client"
import Image from "next/image"
import * as React from "react"
import { ReactNode } from "react"

const Section = ({
	title,
	children,
}: {
	title: string
	children: ReactNode
}) => {
	return (
		<div className={"flex flex-col gap-2"}>
			<Headline size={6}>{title}</Headline>
			<div className={"flex flex-row items-center gap-4"}>{children}</div>
		</div>
	)
}

export const PlayerContent = ({
	id,
	onLocationClick,
}: {
	id: string
	onLocationClick: (id: string) => void
}) => {
	const player = useQuery<PlayerResponse>(playerInfoQuery, {
		variables: { id },
	})

	const { disciplines, avatar, username, city, aboutMe, userPlayLocations } =
		player.data?.player?.data?.attributes || {}

	const avatarUrl = avatar?.data.attributes.url

	return (
		<>
			<LoaderOverlay shown={!player.data} />

			{player.data && (
				<div className={"flex w-full flex-col gap-4"}>
					<div className={"flex flex-row items-center gap-4"}>
						{avatarUrl && (
							<Image
								src={`http://strapi${avatarUrl}`}
								width={120}
								height={120}
								alt={username || ""}
								className={
									"h-20 w-20 rounded-full border border-space-200"
								}
							/>
						)}

						<div className={"flex flex-col gap-1"}>
							<div>
								<Headline
									size={3}
									className={"leading-6"}
								>
									{username}
								</Headline>

								{city && (
									<p className={"text-sm text-space-200"}>
										{city}
									</p>
								)}
							</div>

							{aboutMe && (
								<p
									className={
										"pr-6 text-xs text-space-50 opacity-70"
									}
								>
									{aboutMe}
								</p>
							)}
						</div>
					</div>

					<div className={"h-px w-full bg-space-100 opacity-30"} />

					<div className={"flex flex-col gap-6"}>
						<Section title="Plays:">
							{disciplines?.data.map((discipline) => {
								const icon =
									discipline.attributes.discipline.data
										.attributes.icon?.data.attributes.url

								return (
									<div
										key={discipline.id}
										className={classNames(
											"inline-flex flex-row items-center gap-2 bg-space-200 bg-opacity-20 p-1 pr-4 rounded-full",
										)}
									>
										{icon && (
											<div
												className={
													"flex h-8 w-8 items-center justify-center rounded-full border border-space-100 bg-space-50"
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
												discipline.attributes.discipline
													.data.attributes.name
											}
										</Headline>
									</div>
								)
							})}
						</Section>
					</div>

					<Section title={"Locations:"}>
						{userPlayLocations?.data.map((location) => {
							return (
								<div
									key={location.id}
									className="relative flex cursor-pointer flex-row overflow-hidden rounded-lg border border-space-200/25 bg-space-100/40 shadow"
									onClick={() => {
										onLocationClick(location.id)
									}}
								>
									<Image
										width={160}
										height={90}
										src={
											"http://strapi" +
											location.attributes.image?.data
												.attributes.url
										}
										alt={""}
									/>

									<div className={"flex flex-col gap-2 p-3"}>
										<p className={"text-center text-sm"}>
											{location.attributes.name}
										</p>
									</div>
								</div>
							)
						})}
					</Section>
				</div>
			)}
		</>
	)
}
