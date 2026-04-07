import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'

const config = defineConfig({
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    TanStackRouterVite(),
    viteReact(),
  ],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['src/lib/**', 'src/data/**'],
      reporter: ['text', 'json', 'json-summary'],
      reportsDirectory: 'coverage',
    },
  },
})

export default config
