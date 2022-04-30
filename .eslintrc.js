module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: ['airbnb'],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        radix: ['error', 'as-needed'],
        'no-console': 'error',
        indent: ['error', 4],
    },
};
