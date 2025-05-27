import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        silent: true,
        maxConcurrency: 1,
        isolate: false,
        poolOptions: {
            threads: {
                singleThread: true
            }
        },
        coverage: {
            provider: 'v8', // 👈 Required
            reporter: ['text', 'html'],
            exclude: ['**/tests/**', '**/mocks/**'],
        },
    },
});