const pluginJs = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');

module.exports = [
  { files: ['./src/**/*.{ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'sort-imports': 'off',
      'no-console': 'off',
    },
    ignores: ['node_modules', 'dist'],
  },
];
