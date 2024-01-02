import { sanitize } from "@strapi/utils"
import { mapEntityIds } from "../../helper/map-ids"


export default {
	findOne: async (ctx) => {
		const { id } = ctx.params

		const { members, admins, ...location } = await strapi.entityService.findOne("api::user-group.user-group", id, {
			filters: {
				publishedAt: {
					$ne: null,
				}
			},
			fields: [
				"name",
				"description"
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

		const mappedMembers = mapEntityIds(members)
		const mappedAdmins = mapEntityIds(admins)

		const latLng = {
			latitude: location.location.latitude,
			longitude: location.location.longitude,
		}

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
		const filteredGroups = groups.filter((group) => {
			return group.members.length > 0 || group.admins.length > 0
		})

		// flatten the members and admins
		const flattened = filteredGroups.map((group) => {
			const members = group.members.map((member) => {
				return member.id
			})

			const admins = group.admins.map((admin) => {
				return admin.id
			})

			return {
				...group,
				location: {
					latitude: group.location.latitude,
					longitude: group.location.longitude,
				},
				members: [...members, ...admins],
			}
		})

		return await sanitize.contentAPI.output(
			flattened,
			strapi.getModel("api::user-group.user-group")
		)
	}
}
