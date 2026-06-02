import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: {
        ...globals.node,
        ...globals.jest
      } 
    }
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "off",
      "eqeqeq": "error",
    }
  }
];