import eslint from "@eslint/js"
import tseslint from "typescript-eslint"

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: { parserOptions: { ecmaVersion: "latest", sourceType: "module" } },
    rules: {
      semi: "warn",
      "@typescript-eslint/ban-ts-comment": "off",
      curly: "warn",
      eqeqeq: "warn",
      "no-throw-literal": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "variable", modifiers: ["const"], format: ["camelCase", "UPPER_CASE"] },
        { selector: "interface", format: ["PascalCase"], prefix: ["I"] }
      ]
    }
  },
  { ignores: ["**/*.d.ts", "out/**", "node_modules/**"] }
)
