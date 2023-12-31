import { Headline } from "@/src/components/headline/headline"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { Body } from "@/src/components/sidebar/sidebar"
import { useGetLocation } from "@/src/hooks/data/locations/use-get-location"
import Image from "next/image"
import * as React from "react"
import Markdown from "react-markdown"

export const LocationContent = ({ id }: { id: number }) => {
	const location = useGetLocation(id)
	const imageUrl = location.data?.image?.url

	return (
		<Body className="p-0">
			<LoaderOverlay shown={!location.data} />

			{location.data && (
				<div className={"flex w-full flex-col gap-4"}>
					<div>
						<Headline
							size={3}
							className={"px-4 py-5 leading-6"}
						>
							{location.data.name}
						</Headline>

						{imageUrl && (
							<Image
								src={`http://strapi${imageUrl}`}
								alt={""}
								width={800}
								height={600}
								className={"w-full"}
							/>
						)}
					</div>

					<div className={"flex flex-col gap-2 px-6 py-2"}>
						<div className="text-md prose text-neutral-50 text-opacity-75 prose-a:text-neutral-300 hover:prose-a:text-neutral-400">
							<Markdown>{location.data.description}</Markdown>
						</div>
					</div>
				</div>
			)}
		</Body>
	)
}
