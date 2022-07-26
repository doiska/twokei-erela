// eslint-disable-next-line no-undef
module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"@typescript-eslint",
		"eslint-plugin-import-helpers"
	],
	"rules": {
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1
			}
		],
		"import-helpers/order-imports": [
			"warn",
			{
				"newlinesBetween": "always",
				"groups": [
					[
						"/^discord.js/",
						"/^erela/",
					],
					"/^@client/",
					"/^@/",
					"module",
					[
						"parent",
						"sibling",
						"index"
					]
				],
				"alphabetize": {
					"order": "asc",
					"ignoreCase": true
				}
			}
		],
	}
};
