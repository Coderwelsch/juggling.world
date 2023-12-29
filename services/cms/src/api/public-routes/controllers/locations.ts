import { sanitize } from "@strapi/utils"
import { mapEntityIds } from "../../helper/map-ids"


export default {
	all: async () => {
		const playLocations: any = await strapi.entityService.findMany("api::user-play-location.user-play-location", {
			filters: {
				publishedAt: {
					$ne: null,
				}
			},
			fields: [
				"id",
				"name",
			],
			populate: {
				image: {
					fields: [
						"id",
						"url",
					],
				},
				location: {
					fields: [
						"latitude",
						"longitude",
					],
				},
				users: {
					fields: [
						"id",
					],
				}
			}
		})

		// flatten the members and admins
		const flattened = playLocations.map(({ users, ...location }) => {
			const mappedUsers = mapEntityIds(users)
			const latLng = {
				latitude: location.location.latitude,
				longitude: location.location.longitude,
			}

			return {
				...location,
				location: latLng,
				visitors: mappedUsers,
			}
		})

		return await sanitize.contentAPI.output(
			flattened,
			strapi.getModel("api::user-play-location.user-play-location")
		)
	}
}
