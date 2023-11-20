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
	],
}
