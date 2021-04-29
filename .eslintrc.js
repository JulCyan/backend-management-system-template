module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    "plugin:vue/essential",
    "@vue/standard",
    "@vue/typescript/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "space-before-function-paren": [2, "never"],
    "vue/array-bracket-spacing": "error",
    "vue/arrow-spacing": "error",
    "vue/block-spacing": "error",
    "vue/brace-style": "error",
    "vue/camelcase": "error",
    "vue/comma-dangle": "error",
    "vue/component-name-in-template-casing": "error",
    "vue/eqeqeq": "off",
    "vue/key-spacing": "error",
    "vue/match-component-file-name": "error",
    "vue/object-curly-spacing": "error",
    "vue/html-self-closing": "off",
    "vue/no-v-html": "off",
    "eqeqeq": "off",
    "no-useless-constructor": "off",
    "no-mixed-operators": "off",
    "vue/attribute-hyphenation": "off",
    "no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    'quotes': [2, 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "prefer-const": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off", 
    "@typescript-eslint/ban-ts-comment": "off", 
    "@typescript-eslint/ban-types": "off", 
  }
};
