module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
        'jest/globals': true,
    },
    extends: ['airbnb-base'],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        radix: ['error', 'as-needed'],
        'no-console': 'error',
        indent: ['error', 4],
    },
    overrides: [
        {
            files: ['**/*.test.js'],
            plugins: ['jest'],
            extends: ['plugin:jest/recommended'],
            rules: { 'jest/prefer-expect-assertions': 'off' },
        },
    ],
};
