/**@type {import('eslint').Linter.Config} */

import eslintPluginSvelte from "eslint-plugin-svelte";
import eslintPluginTypescript from "@typescript-eslint/eslint-plugin";

export default [
  ...eslintPluginSvelte.configs["flat/recommended"],
  {
    plugins: {
      "@typescript-eslint": eslintPluginTypescript,
    },
    rules: {
      semi: [2, "always"],
    },
  },
];
