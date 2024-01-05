import { sanitize } from "@strapi/utils"
import { mapEntityIds } from "../../helper/map-ids"


export default {
	findOne: async (ctx) => {
		const { id } = ctx.params

		const { isPrivate, members, admins, ...location } = await strapi.entityService.findOne("api::user-group.user-group", id, {
			filters: {
				publishedAt: {
					$ne: null,
				}
			},
			fields: [
				"name",
				"description",
				"isPrivate",
			],
			populate: {
				avatar: {
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
				members: {
					fields: [
						"id",
					],
				},
				admins: {
					fields: [
						"id",
					],
				}
			}
		})

		const latLng = {
			latitude: location.location.latitude,
			longitude: location.location.longitude,
		}

		// return only the members length when this is a private group
		if (isPrivate) {
			return await sanitize.contentAPI.output(
				{
					...location,
					location: latLng,
					members: [],
					membersLength: members.length,
				},
				strapi.getModel("api::user-group.user-group")
			)
		}

		const mappedMembers = mapEntityIds(members)
		const mappedAdmins = mapEntityIds(admins)

		const flattened = {
			...location,
			location: latLng,
			members: [
				...mappedMembers,
				...mappedAdmins
			],
		}

		return await sanitize.contentAPI.output(
			flattened,
			strapi.getModel("api::user-group.user-group")
		)
	},
	all: async () => {
		const groups = await strapi.entityService.findMany("api::user-group.user-group", {
			filters: {
				publishedAt: {
					$ne: null,
				}
			},
			fields: [
				"isPrivate",
				"name",
			],
			populate: {
				location: {
					fields: [
						"latitude",
						"longitude"
					]
				},
				avatar: {
					fields: [
						"id",
						"url"
					]
				},
				members: {
					fields: [
						"id",
					],
				},
				admins: {
					fields: [
						"id",
					],
				}
			}
		})

		// filter out groups which don’t have any members
		// const filteredGroups = groups.filter((group) => {
		// 	return group.members.length > 0 || group.admins.length > 0
		// })

		// flatten the members and admins
		const flattened = groups.map(({ members, location, admins, ...group }) => {
			if (group.isPrivate) {
				return {
					...group,
					location: {
						latitude: location.latitude,
						longitude: location.longitude,
					},
					members: [],
					membersLength: [...members, ...admins].length,
				}
			}

			const mappedMembers = members.map((member) => {
				return member.id
			})

			const mappedAdmins = admins.map((admin) => {
				return admin.id
			})

			return {
				...group,
				location: {
					latitude: location.latitude,
					longitude: location.longitude,
				},
				members: [...mappedMembers, ...mappedAdmins],
			}
		})

		return await sanitize.contentAPI.output(
			flattened,
			strapi.getModel("api::user-group.user-group")
		)
	}
}
