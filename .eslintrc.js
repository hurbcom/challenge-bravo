module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier', 'plugin:jsdoc/recommended'],
  plugins: ['prettier', 'jsdoc'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    camelcase: 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next', ignoreRestSiblings: true }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.spec.js', '/spec/**'] }],
    'jsdoc/require-returns-type': 0,
    'jsdoc/no-undefined-types': 0,
  },
};
