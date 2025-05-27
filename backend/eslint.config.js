import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [

    {
        ignores: ['dist/**', 'node_modules/**', 'tests/**'],
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        rules: {
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-useless-catch': 'off',
        },
    },
    {
        files: ['tests/**/*.ts'],
        rules: {
            'no-undef': 'off', // allow describe/it/expect
        },
    },
];
