module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["standard-with-typescript", "prettier"],
  plugins: ["prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json"],
  },
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: false,
      },
    ],
    "@typescript-eslint/explicit-function-return-type": "off"
  },
};
