import { Avatar } from "@/src/components/avatar/avatar"
import { Headline } from "@/src/components/headline/headline"
import IconUserLarge from "@/src/components/icons/user-large"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { Body } from "@/src/components/sidebar/sidebar"
import { useGetPlayer } from "@/src/hooks/data/player/use-get-player"
import { classNames } from "@/src/lib/class-names"
import { getStrapiUrl } from "@/src/lib/get-strapi-url"
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
	id: number
	onLocationClick: (id: number) => void
	onDisciplineClick: (id: number) => void
}) => {
	const player = useGetPlayer(id)

	const { disciplines, avatar, username, city, aboutMe, visitedLocations } =
		player.data || {}

	const avatarUrl = avatar?.url

	return (
		<Body>
			<LoaderOverlay shown={!player.data} />

			{player.data && (
				<div className={"flex w-full flex-col gap-5"}>
					<div className={"flex flex-row items-center gap-4"}>
						<Avatar
							src={avatarUrl}
							width={120}
							height={120}
							intent={"coral"}
							alt={username || ""}
							className={"h-20 w-20"}
						/>

						<div className={"flex flex-col gap-1"}>
							<div>
								<Headline
									size={3}
									className={"leading-6"}
								>
									{username}
								</Headline>

								{city && (
									<p className={"text-sm text-neutral-200"}>
										{city}
									</p>
								)}
							</div>

							{aboutMe && (
								<p
									className={
										"pr-6 text-xs text-neutral-50/70"
									}
								>
									{aboutMe}
								</p>
							)}
						</div>
					</div>

					<div className={"h-px w-full bg-neutral-100 opacity-30"} />

					<Section title="Plays:">
						<div className="flex w-full flex-row gap-4">
							{disciplines?.map((discipline) => {
								const { icon, name } = discipline

								const iconUrl = icon?.url

								return (
									<div
										key={discipline.id}
										className={classNames(
											"inline-flex flex-row items-center gap-2 bg-neutral-200 bg-opacity-20 p-1 pr-4 rounded-full",
										)}
									>
										{iconUrl && (
											<div
												className={
													"flex h-6 w-6 items-center justify-center rounded-full border border-neutral-100 bg-neutral-50"
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
						<p className="w-full pr-6 text-sm text-neutral-50/70">
							Last locations where{" "}
							<span className="italic">
								{player.data?.username}
							</span>{" "}
							played:
						</p>

						<div className="flex w-full flex-row gap-2">
							{visitedLocations?.slice(0, 3).map((entry) => {
								const { name, avatar } = entry || {}

								return (
									<div
										key={entry.id}
										className={classNames(
											"w-1/3 relative cursor-pointer flex-col overflow-hidden rounded-lg",
											"border border-neutral-200/25 bg-neutral-100/40 shadow",
											"hover:bg-neutral-100/60 hover:border-neutral-200 transition-colors",
										)}
										onClick={() => {
											onLocationClick(entry.id)
										}}
									>
										<Image
											width={160}
											height={90}
											className={"aspect-video"}
											src={getStrapiUrl(
												avatar?.url || "",
											)}
											alt={`Avatar of ${name}`}
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
