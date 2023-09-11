module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended",
		"plugin:prettier/recommended",
		"plugin:tailwindcss/recommended",
	],
	overrides: [
		{
			env: {
				node: true,
			},
			files: [".eslintrc.{js,cjs}"],
			parserOptions: {
				sourceType: "script",
			},
		},
	],
	ignorePatterns: ["node_modules", "build", "dist", "types/graphql"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["@typescript-eslint", "react", "prettier"],
	rules: {
		"prettier/prettier": [
			"error",
			{
				tabWidth: 4,
				useTabs: true,
				singleQuote: false,
				singleAttributePerLine: true,
				semi: false,
				objectCurlySpacing: true,
				quoteProps: "as-needed",
				arrowParens: "always",
				preferConst: true,
				bracketSpacing: true,
				bracketSameLine: false,
			},
		],
		"linebreak-style": ["error", "unix"],
		"jsx-property-spacing": "off",
		"react/jsx-curly-newline": "off",
	},
}
