/** @type {import("next").NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["cms.localhost", "strapi"],
	},
}

module.exports = nextConfig
