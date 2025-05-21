import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        coverage: {
            provider: 'istanbul',
            reporter: ['text', 'html', 'lcov'],
            exclude: ['node_modules/', 'dist/', '.yarn/'],
            all: true,
            include: ['src/**/*.{ts,js}'],
        },
        include: ['src/**/*.{ts,js}', 'tests/**/*.{ts,js}'],
        exclude: ['node_modules/', 'dist/', '.yarn/', 'src/cli.ts'],
    },
});
