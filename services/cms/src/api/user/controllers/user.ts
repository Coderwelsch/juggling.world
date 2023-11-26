/**
 * A set of functions called "actions" for `user`
 */
import utils from "@strapi/utils"
import { removeFile, uploadFile } from "../services/upload"
import { updateUserSetupAccountState } from "../services/user"

const { sanitize} = utils

export default {
	me: async (ctx) => {
		if (!ctx.state.user) {
			ctx.unauthorized("You're not logged in!")
			return
		}

		const { auth, user } = ctx.state

		const userData = await strapi.entityService.findOne("plugin::users-permissions.user", user.id, {
			populate: ["avatar", "role", "location"],
		})

		ctx.body = await sanitize.contentAPI.output(
			userData,
			strapi.getModel("plugin::users-permissions.user"),
			{ auth }
		)
	},
	update: async (ctx) => {
		if (!ctx.state.user) {
			ctx.unauthorized("You can't update this entry")
			return
		}

		if (ctx.is("multipart")) {
			ctx.badRequest("Multipart request not supported")
			return
		}

		const { id } = ctx.state.user
		const { auth } = ctx.state

		await strapi.entityService.update("plugin::users-permissions.user", id, {
			data: ctx.request.body,
		})

		const user = await updateUserSetupAccountState(id)

		ctx.body = await sanitize.contentAPI.output(
			user,
			strapi.getModel("plugin::users-permissions.user"),
			{ auth }
		)
	},
	uploadAvatar: async (ctx) => {
		if (!ctx.state.user) {
			ctx.unauthorized("You can't update this entry")
			return
		}

		if (!ctx.is("multipart")) {
			ctx.badRequest("Only multipart requests are supported")
			return
		}

		const oldUserData = await strapi.entityService.findOne("plugin::users-permissions.user", ctx.state.user.id, {
			populate: ["avatar"],
		})

		ctx.request.body.refId = ctx.state.user.id
		ctx.request.body.ref = "plugin::users-permissions.user"
		ctx.request.body.field = "avatar"

		const result = await uploadFile(ctx)

		// delete old avatar
		if (oldUserData.avatar) {
			await removeFile(oldUserData.avatar.id)
		}

		const { auth } = ctx.state

		ctx.body = await sanitize.contentAPI.output(
			result,
			strapi.getModel("plugin::upload.file"),
			{ auth }
		)
	}
}
