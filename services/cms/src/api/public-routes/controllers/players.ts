import { sanitize } from "@strapi/utils"
import { mapEntityIds } from "../../helper/map-ids"


export default {
	findOne: async (ctx) => {
		const { id } = ctx.params

		const user: any = await strapi.entityService.findOne("plugin::users-permissions.user", id, {
			filters: {
				confirmed: true,
				blocked: false,
			},
			fields: [
				"id",
				"username",
				"aboutMe",
				"city",
			],
			populate: {
				disciplines: {
					fields: [
						"id",
					],
					populate: {
						discipline: {
							fields: [
								"id",
								"name",
							],
							populate: {
								icon: {
									fields: [
										"id",
										"url",
									],
								}
							}
						}
					}
				},
				avatar: {
					fields: [
						"id",
						"url"
					]
				},
				location: {
					fields: [
						"latitude",
						"longitude",
					],
				},
				groups: {
					fields: [
						"id",
						"name",
					],
				},
				adminGroups: {
					fields: [
						"id",
						"name"
					],
				},
				userPlayLocations: {
					fields: [
						"id",
						"name"
					]
				}
			}
		})

		// get rid of unneeded id
		const location = user.location ? {
			latitude: user.location.latitude,
			longitude: user.location.longitude,
		} : null

		return await sanitize.contentAPI.output(
			{
				...user,
				location,
				playLocations: user.userPlayLocations,
			},
			strapi.getModel("plugin::users-permissions.user")
		)
	},
	all: async (ctx) => {
		const users: any = await strapi.entityService.findMany("plugin::users-permissions.user", {
			filters: {
				confirmed: true,
				blocked: false,
			},
			fields: [
				"id",
				"username",
			],
			populate: {
				disciplines: {
					fields: [
						"id"
					]
				},
				avatar: {
					fields: [
						"id",
						"url"
					]
				},
				location: {
					fields: [
						"latitude",
						"longitude",
					],
				},
				groups: {
					fields: [
						"id",
					],
				},
				adminGroups: {
					fields: [
						"id",
					],
				},
				userPlayLocations: {
					fields: [
						"id"
					]
				}
			}
		})

		const sanitizedUsers = users.reduce((aggregator, user) => {
			// only get ids for groups and admin groups
			const groups = mapEntityIds(user.groups)
			const adminGroups = mapEntityIds(user.adminGroups)
			const disciplines = mapEntityIds(user.disciplines)
			const playLocations = mapEntityIds(user.userPlayLocations)

			// skip users without locations
			if (!user.location) {
				return aggregator
			}

			// get rid of unneeded id
			const location = user.location ? {
				latitude: user.location.latitude,
				longitude: user.location.longitude,
			} : null

			aggregator.push({
				...user,
				playLocations,
				location,
				groups,
				disciplines,
				adminGroups,
			})

			return aggregator
		}, [])

		return await sanitize.contentAPI.output(
			sanitizedUsers,
			strapi.getModel("plugin::users-permissions.user")
		)
	}
}
