import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": "error",
      //"no-undef": "error",
      "no-unused-expressions": "error",
      "prefer-const": "warn",
      //"no-console": "warn",
      "no-empty-object-type": "error",
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    }
  }
  

];