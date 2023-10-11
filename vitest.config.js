import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './tests/unit/coverage'
    },
    watchExclude: ['src/http/controllers/**/**']
  }
})
