import { Headline } from "@/src/components/headline/headline"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { Body } from "@/src/components/sidebar/sidebar"
import { playLocationQuery, PlayLocationResponse } from "@/src/queries/play-location-info"
import { useQuery } from "@apollo/client"
import Image from "next/image"
import * as React from "react"
import Markdown from "react-markdown"


export const LocationContent = ({ id }: { id: string }) => {
	const location = useQuery<PlayLocationResponse>(playLocationQuery, {
		variables: { id },
	})

	const imageUrl =
		location.data?.location.data.attributes.image?.data.attributes.url

	return (
		<Body className="p-0">
			<LoaderOverlay shown={!location.data} />

			{location.data && (
				<div className={"flex w-full flex-col gap-4"}>
					<div className={"flex flex-col gap-4"}>
						{imageUrl && (
							<Image
								src={`http://strapi${imageUrl}`}
								alt={""}
								width={800}
								height={600}
								className={"w-full"}
							/>
						)}

						<div className={ "flex flex-col gap-2 px-6 py-2" }>
							<Headline
								size={ 3 }
								className={ "leading-6" }
							>
								{ location.data.location.data.attributes.name }
							</Headline>

							<div className="prose text-sm text-space-50 text-opacity-75 prose-a:text-space-300 hover:prose-a:text-space-400">
								<Markdown>
									{
										location.data.location.data.attributes
											.description
									}
								</Markdown>
							</div>
						</div>
					</div>
				</div>
			)}
		</Body>
	)
}
