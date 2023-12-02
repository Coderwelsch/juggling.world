import { sanitize } from "@strapi/utils"


export default {
	createDiscipline: async (ctx) => {
		if (!ctx.state.user) {
			ctx.unauthorized("You can't create this discipline")
			return
		}

		const discipline: unknown = ctx.request.body.discipline

		if (!discipline) {
			ctx.badRequest("No discipline provided")
			return
		}

		if (typeof discipline !== "number") {
			ctx.badRequest("Invalid discipline id provided")
			return
		}

		const { id } = ctx.state.user

		const result = await strapi.entityService.create("api::user-discipline.user-discipline", {
			data: {
				user: id,
				discipline,
				publishedAt: Date.now(),
			},
		})

		ctx.body = await sanitize.contentAPI.output(
			result,
			strapi.getModel("api::user-discipline.user-discipline"),
			{ auth: ctx.state.auth }
		)
	}
}
