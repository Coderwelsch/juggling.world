export default ({ env }) => {
	const config = ({
		host: env("HOST", "0.0.0.0"),
		port: env.int("PORT", 80),
		url: `${ env("PUBLIC_URL", "http://cms.localhost") }`,
		app: {
			proxy: env.bool("APP_PROXY", false),
			keys: env.array("APP_KEYS"),
		},
		webhooks: {
			populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
		},
	})

	return config
}
