import path from "path"


export default ({ env }) => ({
	graphql: {
		config: {
			endpoint: "/graphql",
			shadowCRUD: true,
			playgroundAlways: false,
			depthLimit: 15,
			amountLimit: 10_000,
			generateArtifacts: true,
			apolloServer: {
				tracing: true,
			},
			artifacts: {
				schema: path.join(__dirname, "..", "..", "types/graphql/graphql-schema.graphql"),
				typegen: path.join(__dirname, "..", "..", "types/graphql/graphql-types.d.ts"),
			},
		},
	},
	email: {
		config: {
			provider: "nodemailer",
			providerOptions: {
				host: env("SMTP_HOST"),
				port: env("SMTP_PORT"),
				secure: true,
				auth: {
					user: env("SMTP_USERNAME"),
					pass: env("SMTP_PASSWORD"),
				},
			},
			settings: {
				defaultFrom: env("DEFAULT_EMAIL_FROM"),
				defaultReplyTo: env("DEFAULT_EMAIL_REPLY_TO"),
			},
		},
	},
	"duplicate-button": true
})
