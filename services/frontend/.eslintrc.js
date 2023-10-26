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
		"plugin:react-hooks/recommended",
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
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": "off",
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
		"react/destructuring-assignment": ["error", "always"],
		"react/react-in-jsx-scope": "off",
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "error",
	},
}
