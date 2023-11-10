export default ({ env }) => ({
	host: env("HOST", "0.0.0.0"),
	port: env.int("PORT", 80),
	url: "/admin",
	auth: {
		secret: env("ADMIN_JWT_SECRET"),
	},
	apiToken: {
		salt: env("API_TOKEN_SALT"),
	},
	transfer: {
		token: {
			salt: env("TRANSFER_TOKEN_SALT"),
		},
	},
	flags: {
		nps: env.bool("FLAG_NPS", true),
		promoteEE: env.bool("FLAG_PROMOTE_EE", true),
	},
})
