export default {
	routes: [
		{
			method: "GET",
			path: "/user/me",
			handler: "user.me",
			config: {
				policies: ["is-authenticated"],
				middlewares: [],
			},
		},
		{
			method: "PUT",
			path: "/user/me",
			handler: "user.update",
			config: {
				policies: ["is-authenticated"],
				middlewares: [],
			},
		},
		{
			method: "PUT",
			path: "/user/avatar",
			handler: "user.uploadAvatar",
			config: {
				policies: ["is-authenticated"],
				middlewares: [],
			},
		},
		{
			method: "PUT",
			path: "/user/discipline",
			handler: "disciplines.createDiscipline",
			config: {
				policies: ["is-authenticated"],
				middlewares: [],
			},
		},
		{
			method: "GET",
			path: "/user/group",
			handler: "groups.getOwnGroups",
			config: {
				policies: ["is-authenticated"],
				middlewares: [],
			},
		},
		{
			method: "POST",
			path: "/user/group",
			handler: "groups.create",
			config: {
				policies: ["is-authenticated"],
				middlewares: ["api::user.group-validate"],
			},
		},
	],
}
