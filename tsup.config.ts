import { defineConfig } from 'tsup'

export default defineConfig({
    dts: true,
    format: ['cjs', 'esm'],
    outDir: 'dist',
    entry: ['src/cli.ts', 'src/index.ts'],
    inject: ['./import.meta.shim.js'],
})