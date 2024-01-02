export default {
	routes: [
		{
			method: "GET",
			path: "/public/groups",
			handler: "groups.all",
			config: {
				policies: [],
				middlewares: [],
			},
		},
		{
			method: "GET",
			path: "/public/groups/:id",
			handler: "groups.findOne",
			config: {
				policies: [],
				middlewares: [],
			},
		},
		{
			method: "GET",
			path: "/public/locations",
			handler: "locations.all",
			config: {
				policies: [],
				middlewares: [],
			},
		},
		{
			method: "GET",
			path: "/public/locations/:id",
			handler: "locations.findOne",
			config: {
				policies: [],
				middlewares: [],
			},
		},
		{
			method: "GET",
			path: "/public/players",
			handler: "players.all",
			config: {
				policies: [],
				middlewares: [],
			},
		},
		{
			method: "GET",
			path: "/public/players/:id",
			handler: "players.findOne",
			config: {
				policies: [],
				middlewares: [],
			},
		},
	],
}
