import globals from 'globals';
import pluginJs from '@eslint/js';
import prettier from 'eslint-plugin-prettier';

export default [
    { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
        },
        rules: {
            'no-unused-vars': [
                'errors',
                {
                    vars: 'all',
                    args: 'none',
                    caughtErrors: 'none',
                },
            ],
            'no-var': 'error',
            'no-undef': 'error',
            'prefer-const': 'error',
            eqeqeq: 'error',
            'no-console': 'warn',
            'no-debugger': 'warn',
            semi: ['error', 'always'],
            indent: ['error', 4],
            curly: ['error', 'all'],
            'brace-style': ['error', '1tbs'],
            'prettier/prettier': 'error',
        },
        plugins: {
            prettier,
        },
        ignores: ['node_modules'],
    },
    pluginJs.configs.recommended,
];
