import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
	overwrite: true,
	schema: "http://strapi/graphql",
	generates: {
		"./src/types/cms/graphql.ts": {
			plugins: ["typescript"],
		},
	},
}

export default config
