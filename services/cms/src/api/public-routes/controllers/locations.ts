import { sanitize } from "@strapi/utils"
import { mapEntityIds } from "../../helper/map-ids"


export default {
	findOne: async (ctx) => {
		const { id } = ctx.params

		const { users, ...playLocation }: any = await strapi.entityService.findOne("api::user-play-location.user-play-location", id, {
			filters: {
				publishedAt: {
					$ne: null,
				}
			},
			fields: [
				"id",
				"name",
				"description"
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

		const mappedUsers = mapEntityIds(users)

		const latLng = {
			latitude: playLocation.location.latitude,
			longitude: playLocation.location.longitude,
		}

		const flattened = {
			...playLocation,
			location: latLng,
			visitors: mappedUsers,
		}

		return await sanitize.contentAPI.output(
			flattened,
			strapi.getModel("api::user-play-location.user-play-location")
		)
	},
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
