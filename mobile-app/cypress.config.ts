import { defineConfig } from 'cypress';

export default defineConfig({
  includeShadowDom: true,

  e2e: {
    baseUrl: 'http://localhost:5173',
    experimentalRunAllSpecs: true,
    specPattern: ['./cypress/e2e/**/*.cy.ts'],
    viewportHeight: 896,
    viewportWidth: 414,
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
