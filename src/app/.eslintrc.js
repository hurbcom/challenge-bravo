module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true,
        jest: true,
    },
    extends: ['airbnb-base', 'prettier'],
    plugins: ['prettier', 'promise'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
    },
    rules: {
        'no-param-reassign': "off",
        'class-methods-use-this': 'off',
        camelcase: 'off',
        'global-require': 'off',
        'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
        'no-console': 'off',
        'promise/always-return': 'error',
        'promise/no-return-wrap': 'error',
        'promise/param-names': 'error',
        'promise/catch-or-return': 'error',
        'promise/no-native': 'off',
        'promise/no-nesting': 'error',
        'promise/no-promise-in-callback': 'error',
        'promise/no-callback-in-promise': 'error',
        'promise/no-return-in-finally': 'error',
        'prefer-arrow-callback': 'error',
        'no-underscore-dangle': 'off',
        'consistent-return': 'off',
    },
};
