/**
 * user service
 */

export const updateUserSetupAccountState = async (id: number) => {
	const missing: string[] = []

	const user = await strapi.entityService.findOne("plugin::users-permissions.user", id, {
		populate: [ "location", "avatar", "disciplines" ],
	})

	if (!user.location) {
		missing.push("location")
	}

	if (!user.aboutMe) {
		missing.push("aboutMe")
	}

	if (!user.avatar) {
		missing.push("avatar")
	}

	if (user.disciplines.length === 0) {
		missing.push("disciplines")
	}

	const hasFinishedSetup = missing.length === 0

	if (user.finishedSetup !== hasFinishedSetup) {
		return await strapi.entityService.update("plugin::users-permissions.user", id, {
			data: {
				finishedSetup: hasFinishedSetup,
			},
		})
	}

	return user
}
