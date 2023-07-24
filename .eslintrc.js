module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: "airbnb-base",
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
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-console": "error",
    "no-undef": "error",
    quotes: ["error", "double"],
    semi: "off",
    "linebreak-style": "off",
    "comma-dangle": "off",
    "no-underscore-dangle": "off",
  },
}
