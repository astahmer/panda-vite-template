import { defineConfig } from '@pandacss/dev'
import { recipes } from './theme/recipes'
import { semanticTokens, tokens } from './theme/tokens'

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens,
      semanticTokens,
      recipes: {
        button: {
          className: 'button',
          base: {
            display: 'flex',
          },
          variants: {
            shape: {
              square: { borderRadius: '0' },
              circle: { borderRadius: 'full' },
            },
          },
          staticCss: ['*'],
        },
        input: {
          className: 'input',
          base: {
            display: 'block',
          },
          variants: {
            size: {
              sm: { padding: '4', fontSize: '12px' },
              lg: { padding: '8', fontSize: '40px' },
            },
          },
          staticCss: ['*'],
        },
        text: {
          className: 'text',
          base: {
            display: 'inline',
          },
          variants: {
            visual: {
              funky: { bg: 'red.200', color: 'slate.800' },
              edgy: { border: '1px solid {colors.red.500}' },
            },
          },
          staticCss: ['*'],
        },
      },
    },
  },
  globalCss: {
    'html, body': {
      color: 'text.main',
      backgroundColor: 'bg.main',
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',

  // The JSX framework to use
  jsxFramework: 'react',
})
