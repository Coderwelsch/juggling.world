import { File } from "@babel/types"
import { parseMultipartData, sanitize } from "@strapi/utils"

interface UserGroupInput {
	avatar?: File
	location: {
		latitude: number
		longitude: number
	},
	contact?: {
		email?: string | null; // String
		facebook?: string | null; // String
		id?: string | null; // ID
		instagram?: string | null; // String
		reddit?: string | null; // String
		signal?: string | null; // String
		telegram?: string | null; // String
		whatsapp?: string | null; // String
	}
	description?: string
	members?: number[]
	name: string
}

export default {
	create: async (ctx) => {
		console.log("create group", ctx)

		if (!ctx.state.user) {
			ctx.unauthorized("You can't create a group without being logged in")
			return
		}

		// await ctx.validate()

		let parsedBody: UserGroupInput | undefined

		// check if multipart
		if (ctx.is("multipart")) {
			// const data: UserGroupInput = JSON.parse(ctx.request.body.data)
			const parsedMultipart = parseMultipartData(ctx)

			if (!parsedMultipart) {
				ctx.badRequest("No group data provided for multipart request")
				return
			}

			const { data, files } = parsedMultipart

			console.log("parsedMultipart", parsedMultipart)

			if (files && files.avatar) {
				data.avatar = files.avatar
			}

			parsedBody = data
		} else {
			parsedBody = JSON.parse(ctx.request.body)
		}

		if (!parsedBody) {
			ctx.badRequest("No group data provided")
			return
		}

		if (!parsedBody.name) {
			ctx.badRequest("No group name provided")
			return
		}

		if (!parsedBody.description) {
			ctx.badRequest("No group description provided")
			return
		}

		console.error("parsedBody", parsedBody)

		if (!parsedBody.location || !parsedBody.location.latitude || !parsedBody.location.longitude) {
			ctx.badRequest("No or wrong group location provided: " + parsedBody.location.toString())
			return
		}

		await sanitize.contentAPI.input(parsedBody, strapi.getModel("api::user-group.user-group"))

		const { id } = ctx.state.user

		const result = await strapi.entityService.create("api::user-group.user-group", {
			data: {
				name: parsedBody.name,
				admins: [id],
				description: parsedBody.description,
				createdBy: id,
				location: parsedBody.location,
				avatar: parsedBody.avatar,
				publishedAt: Date.now(),
			},
		})

		ctx.body = await sanitize.contentAPI.output(
			result,
			strapi.getModel("api::user-group.user-group"),
			{ auth: ctx.state.auth }
		)
	},

	getOwnGroups: async (ctx) => {
		const { id } = ctx.state.user

		const result = await strapi.entityService.findMany("api::user-group.user-group", {
			filters: {
				$or: [
					{ admins: id },
					{ members: id },
				],
			},
			populate: [
				"admins",
				"members",
			],
		}).then((groups) => {
			return groups.map(({ admins, members, ...group }) => {
				const isAdmin = admins.some((admin) => admin.id === id)
				const isMember = members.some((member) => member.id === id)

				const memberIds = members.map(({ id }) => id)
				const adminIds = admins.map(({ id }) => id)

				return {
					...group,
					isAdmin,
					admins: adminIds,

					isMember,
					members: memberIds,
				}
			})
		})

		ctx.body = await sanitize.contentAPI.output(
			result,
			strapi.getModel("api::user-group.user-group"),
			{ auth: ctx.state.auth }
		)
	}
}
