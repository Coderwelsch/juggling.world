export default {
	register ({ strapi }) {
		// const extensionService = strapi.service("plugin::graphql.extension")
		//
		// extensionService.use(({strapi}) => {
		// 	return {
		// 		typeDefs: `
		// 			type Query {
		// 				me: UsersPermissionsMe
		// 			}
		// 		`,
		// 		resolvers: {
		// 			Query: {
		// 				me: {
		// 					resolve: async (parent, args, context) => {
		// 						if (!context.state.user) {
		// 							return context.unauthorized("You are not logged in")
		// 						}
		//
		// 						const { id } = context.state.user
		//
		// 						const result = await strapi.entityService.findOne("plugin::users-permissions.user", id, {})
		// 						return result
		// 					},
		// 				},
		// 			}
		// 		},
		// 		resolversConfig: {
		// 			"Query.me": {
		// 				auth: true,
		// 			},
		// 		},
		// 	}
		// })
	},

	/**
	 * An asynchronous bootstrap function that runs before
	 * your application gets started.
	 *
	 * This gives you an opportunity to set up your data model,
	 * run jobs, or perform some special logic.
	 */
	bootstrap ({ strapi }) {
		// console.log("bootstrap", strapi)

		strapi.db.lifecycles.subscribe({
			models: ["plugin::users-permissions.user"],

			async afterUpdate(event) {
				// check if user has setup their profile
				const reqData = event.params.data

				console.log("afterUpdate", reqData)

				// let userHasFinishedSetup = true
				//
				// if (!reqData.location || !reqData.avatar) {
				// 	userHasFinishedSetup = false
				// }
				//
				// // dont update if the user has not changed their setup status
				// if (userHasFinishedSetup === reqData.finishedSetup) {
				// 	return
				// }
				//
				// console.log("update user", userHasFinishedSetup)
				//
				// await strapi.entityService.update("plugin::users-permissions.user", reqData.id, {
				// 	data: { finishedSetup: userHasFinishedSetup }
				// })
			},
		})
	},
}
