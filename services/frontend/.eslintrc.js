module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	settings: {
		react: {
			version: "detect",
		},
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended",
		"plugin:prettier/recommended",
		"plugin:tailwindcss/recommended",
		"plugin:react-hooks/recommended",
		"plugin:@next/next/recommended",
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
	ignorePatterns: [
		"node_modules",
		"build",
		"dist",
		"types",
		"src/types/graphql",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["@typescript-eslint", "react", "prettier"],
	rules: {
		"@typescript-eslint/ban-ts-comment": "off",
		"tailwindcss/classnames-order": "warn",
		"max-len": [
			"error",
			{
				code: 160,
				ignoreComments: true,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
				ignoreRegExpLiterals: true,
			},
		],
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
		"react/display-name": "off",
		"react/jsx-curly-newline": "off",
		"react/destructuring-assignment": ["error", "always"],
		"react/react-in-jsx-scope": "off",
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "error",
	},
}
