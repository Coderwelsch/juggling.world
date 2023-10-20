export const getStrapiUrl = (path: string) => {
	if (!path.startsWith("/")) {
		console.error("Path must start with a slash", path)
		return path
	}

	return "http://strapi" + path
}
