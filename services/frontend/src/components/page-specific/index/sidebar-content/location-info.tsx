import { classNames } from "@/src/lib/class-names"
import { LocationType } from "@/src/types/cms/api"
import { Headline } from "@/src/components/headline/headline"
import IconLocation from "@/src/components/icons/location"
import IconTeamwork from "@/src/components/icons/teamwork"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { Body } from "@/src/components/sidebar/sidebar"
import { useGetLocation } from "@/src/hooks/data/locations/use-get-location"
import Image from "next/image"
import { JSXElementConstructor, SVGProps } from "react"
import * as React from "react"
import Markdown from "react-markdown"

const LocationIconMap: Record<
	LocationType,
	{
		icon: JSXElementConstructor<SVGProps<SVGSVGElement>>
		label: string
	}
> = {
	[LocationType.Park]: { icon: IconLocation, label: "Park" },
	[LocationType.BasketballCourt]: {
		icon: IconLocation,
		label: "Basketball Court",
	},
	[LocationType.Skatepark]: { icon: IconLocation, label: "Skatepark" },
	[LocationType.GymHall]: { icon: IconTeamwork, label: "Gym Hall" },
	[LocationType.Other]: { icon: IconLocation, label: "Other" },
}

const sublineStyles: Record<LocationType, string> = {
	[LocationType.Park]: "text-mint-500",
	[LocationType.BasketballCourt]: "text-mint-500",
	[LocationType.Skatepark]: "text-mint-500",
	[LocationType.GymHall]: "text-mint-500",
	[LocationType.Other]: "text-neutral-100",
}

export const Subline = ({ type }: { type?: LocationType }) => {
	if (!type || !LocationIconMap[type]) {
		return null
	}

	const Icon = LocationIconMap[type].icon
	const label = LocationIconMap[type].label
	const sublineStyle = sublineStyles[type]

	return (
		<Headline
			size={6}
			className={classNames("flex items-center gap-1", sublineStyle)}
		>
			<Icon className={"h-4 w-4"} />

			<span>{label}</span>
		</Headline>
	)
}

export const LocationContent = ({ id }: { id: number }) => {
	const location = useGetLocation(id)
	const imageUrl = location.data?.image?.url

	return (
		<Body className="p-0">
			<LoaderOverlay shown={!location.data} />

			{location.data && (
				<div className={"flex w-full flex-col gap-4"}>
					<div className={"flex flex-col gap-1 px-6 pt-4"}>
						<Headline
							size={3}
							className={"leading-6"}
						>
							{location.data.name}
						</Headline>

						<Subline type={location.data.type} />
					</div>
					{imageUrl && (
						<Image
							src={`http://strapi${imageUrl}`}
							alt={""}
							width={800}
							height={600}
							className={"w-full"}
						/>
					)}
					<div className={"flex flex-col gap-2 px-6 py-2"}>
						<div className="text-sm prose text-neutral-50 text-opacity-75 prose-a:text-neutral-300 hover:prose-a:text-neutral-400">
							<Markdown>{location.data.description}</Markdown>
						</div>
					</div>
				</div>
			)}
		</Body>
	)
}
