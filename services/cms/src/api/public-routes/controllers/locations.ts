import { sanitize } from "@strapi/utils"
import { mapEntityIds } from "../../helper/map-ids"


export default {
	findOne: async (ctx) => {
		const { id } = ctx.params

		const { visitors, ...location } = await strapi.entityService.findOne("api::location.location", id, {
			filters: {
				publishedAt: {
					$ne: null,
				}
			},
			fields: [
				"type",
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
				visitors: {
					fields: [
						"id",
					],
				}
			}
		})

		const mappedUsers = mapEntityIds(visitors)

		const latLng = {
			latitude: location.location.latitude,
			longitude: location.location.longitude,
		}

		const flattened = {
			...location,
			location: latLng,
			visitors: mappedUsers,
		}

		return await sanitize.contentAPI.output(
			flattened,
			strapi.getModel("api::location.location")
		)
	},
	all: async () => {
		const locations = await strapi.entityService.findMany("api::location.location", {
			filters: {
				publishedAt: {
					$ne: null,
				}
			},
			fields: [
				"name",
				"type",
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
				visitors: {
					fields: [
						"id",
					],
				}
			}
		})

		// flatten the members and admins
		const flattened = locations.map(({ visitors, ...location }) => {
			const mappedUsers = visitors ? mapEntityIds(visitors) : []

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
			strapi.getModel("api::location.location")
		)
	}
}
