import { defineConfig } from '@pandacss/dev'
import { createPreset } from '@park-ui/panda-preset'
import { removeUnusedCssVars } from './remove-unused-css-vars'
import { removeUnusedKeyframes } from './remove-unused-keyframes'

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  jsxFramework: 'react',
  jsxStyleProps: 'minimal',
  // lightningcss: true,
  // Where to look for your css declarations
  include: ['./src/**/*.{ts,tsx}'],
  presets: [
    '@pandacss/preset-base',
    createPreset({
      accentColor: 'neutral',
      grayColor: 'neutral',
      // additionalColors: ['red'],
    }),
  ],
  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {},
  },

  // Optimize options: https://github.com/chakra-ui/panda/discussions/2236
  // hooks: {
  //   'cssgen:done': ({ artifact, content }) => {
  //     if (artifact === 'styles.css') {
  //       return removeUnusedCssVars(removeUnusedKeyframes(content))
  //     }
  //   },
  // },
  // The output directory for your css system
  outdir: 'styled-system',
})
