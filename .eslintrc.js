module.exports = {
    root: true,

    ignorePatterns: ['**/*/*.js', '*.js', '*.svg', '*.json', '*.png', 'package.json', 'package-lock.json'],
    env: {
        browser: true,
        es2021: true,
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
    rules: {
        quotes: [
            'error',
            'double',
            {
                avoidEscape: true,
            },
        ],
        '@typescript-eslint/ban-ts-comment': 'warn',
        'comma-dangle': 'off',
        'multiline-ternary': 'off',
        'no-use-before-define': 'off',
        'space-before-function-paren': 'off',
        'react/prop-types': 'off',
        'react/no-unescaped-entities': 'off',
        'react/display-name': 'off',
        'react/react-in-jsx-scope': 'off',
        'prefer-destructuring': 2,
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
    },
};
