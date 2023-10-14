import { Headline } from "@/src/components/headline/headline"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import {
	playLocationQuery,
	PlayLocationResponse,
} from "@/src/queries/play-location-info"
import { useQuery } from "@apollo/client"
import Image from "next/image"
import * as React from "react"

export const LocationContent = ({ id }: { id: string }) => {
	const location = useQuery<PlayLocationResponse>(playLocationQuery, {
		variables: { id },
	})

	console.log("location.data", location.data)

	const imageUrl =
		location.data?.location.data.attributes.image?.data.attributes.url

	return (
		<>
			<LoaderOverlay shown={!location.data} />

			{location.data && (
				<div className={"flex w-full flex-col gap-4"}>
					<div className={"flex flex-row items-center gap-4"}>
						{imageUrl && (
							<Image
								src={`http://strapi${imageUrl}`}
								alt={""}
								width={800}
								height={600}
								className={
									"h-20 w-20 rounded-full border border-space-200"
								}
							/>
						)}

						<div className={"flex flex-col gap-1"}>
							<Headline
								size={3}
								className={"leading-6"}
							>
								{location.data.location.data.attributes.name}
							</Headline>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
