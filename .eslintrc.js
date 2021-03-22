module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 12
    },
    rules: {
        indent: [
            'error',
            4,
            {
                SwitchCase: 1
            }
        ],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'max-len': [
            'error',
            {
                'code': 100,
                'ignoreStrings': true
            }
        ],
        complexity: ['error', 12],
        'new-cap': [
            'error',
            {
                newIsCap: true,
                capIsNew: true,
                //Express Router is an UpperCase named function
                capIsNewExceptions: ['Router']
            }
        ],
        'newline-per-chained-call': [
            'error',
            {
                ignoreChainWithDepth: 2
            }
        ]
    }
}