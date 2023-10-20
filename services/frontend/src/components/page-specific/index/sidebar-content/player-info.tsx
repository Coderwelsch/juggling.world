import { Avatar } from "@/src/components/avatar/avatar"
import { Headline } from "@/src/components/headline/headline"
import IconUserLarge from "@/src/components/icons/user-large"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { Body } from "@/src/components/sidebar/sidebar"
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
		<div className={"flex flex-col gap-1"}>
			<Headline size={5}>{title}</Headline>
			<div className={"flex flex-col items-center gap-2"}>{children}</div>
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

	const avatarUrl = avatar?.data?.attributes.url

	return (
		<Body>
			<LoaderOverlay shown={!player.data} />

			{player.data && (
				<div className={"flex w-full flex-col gap-5"}>
					<div className={"flex flex-row items-center gap-4"}>
						{avatarUrl ? (
							<Avatar
								src={avatarUrl}
								width={120}
								height={120}
								alt={username || ""}
								className={
									"h-20 w-20 rounded-full border border-space-200"
								}
							/>
						) : (
							<div
								className={
									"flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-space-200 bg-fuchsia-400"
								}
							>
								<IconUserLarge
									className={"h-12 w-12 fill-neutral-50"}
								/>
							</div>
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
								<p className={"pr-6 text-xs text-space-50/70"}>
									{aboutMe}
								</p>
							)}
						</div>
					</div>

					<div className={"h-px w-full bg-space-100 opacity-30"} />

					<Section title="Plays:">
						<div className="flex w-full flex-row gap-4">
							{disciplines?.data.map((discipline) => {
								const { icon, name } =
									discipline.attributes.discipline.data
										.attributes || {}

								const iconUrl = icon?.data.attributes.url

								return (
									<div
										key={discipline.id}
										className={classNames(
											"inline-flex flex-row items-center gap-2 bg-space-200 bg-opacity-20 p-1 pr-4 rounded-full",
										)}
									>
										{iconUrl && (
											<div
												className={
													"flex h-6 w-6 items-center justify-center rounded-full border border-space-100 bg-space-50"
												}
											>
												<Image
													className={classNames(
														"h-4 w-4",
													)}
													alt={""}
													width={32}
													height={32}
													src={`http://strapi${iconUrl}`}
												/>
											</div>
										)}

										<Headline
											size={6}
											renderAs={"h2"}
										>
											{name}
										</Headline>
									</div>
								)
							})}
						</div>
					</Section>

					<Section title={"Locations:"}>
						<p className="w-full pr-6 text-sm text-space-50/70">
							Last locations where{" "}
							<span className="italic">
								{
									player.data?.player?.data?.attributes
										?.username
								}
							</span>{" "}
							played:
						</p>

						<div className="flex w-full flex-row space-x-4">
							{userPlayLocations?.data.map((entry) => {
								const { name, image } = entry.attributes || {}

								return (
									<div
										key={entry.id}
										className={classNames(
											"relative cursor-pointer flex-col overflow-hidden rounded-lg",
											"border border-space-200/25 bg-space-100/40 shadow",
											"hover:bg-space-100/60 hover:border-space-200 transition-colors",
										)}
										onClick={() => {
											onLocationClick(entry.id)
										}}
									>
										<Image
											width={160}
											height={90}
											objectFit={"cover"}
											className={"aspect-video"}
											src={
												"http://strapi" +
												image?.data.attributes.url
											}
											alt={""}
										/>

										<div
											className={
												"flex w-full flex-col gap-2 p-1"
											}
										>
											<p
												className={
													"w-full text-ellipsis text-center text-xs"
												}
											>
												{name}
											</p>
										</div>
									</div>
								)
							})}
						</div>
					</Section>
				</div>
			)}
		</Body>
	)
}
