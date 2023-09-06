export default ({ env }) => ({
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
	"drag-drop-content-types": {
		enabled: true,
	},
})
