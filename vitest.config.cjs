/** @type {import('vitest').UserConfig} */
module.exports = {
  test: {
    globals: true,
    coverage: {
      provider: 'c8',
      reporter: ['text'],
      exclude: ['node_modules/', 'dist/', '.yarn/'],
      all: true,
      include: ['src/**/*.{ts,js}'],
    },
  },
};