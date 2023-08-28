module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'airbnb-base',
        'airbnb-typescript/base',
        'prettier',
        'plugin:node/recommended',
    ],
    overrides: [],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './tsconfig.eslint.json'],
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
        'no-unused-vars': 'warn',
        'no-console': 'off',
        'func-names': 'off',
        'no-plusplus': 'off',
        'no-process-exit': 'off',
        'class-methods-use-this': 'off',
        'node/no-unsupported-features/es-syntax': 'off',
        'import/no-unresolved': 'off',
        'node/no-missing-import': [
            'error',
            {
                tryExtensions: ['.ts'],
            },
        ],
        'import/extensions': 'off',
        'no-param-reassign': ['error', { props: false }],
        'import/prefer-default-export': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error', { ignoreTypeValueShadow: true }],
    },
};
