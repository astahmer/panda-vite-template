import { defineConfig } from '@pandacss/dev'
import postcss, { type TransformCallback } from 'postcss'
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
        unsorted: {
          className: 'unsorted',
          base: {
            display: 'table',
          },
          variants: {
            variant: {
              outline: { outline: '1px solid {colors.red.500}' },
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
  hooks: {
    'cssgen:done': (args) => {
      if (args.artifact !== 'styles.css') return

      const css = postcss([reorderRecipes({ order: ['text', 'input', 'button'] })])
        .process(args.content)
        .toString()
      return css
    },
  },
})

interface ReorderRecipesOptions {
  order: string[]
  layerName?: string
}

const reorderRecipes = (opts: ReorderRecipesOptions): TransformCallback => {
  const options = { layerName: 'recipes', ...opts }
  const { layerName, order } = options

  return (root) => {
    const rulesByRecipeName = new Map<string, postcss.Rule[]>()
    root.walkAtRules('layer', (layerRule) => {
      if (layerRule.params !== layerName) return

      layerRule.walkAtRules('layer', (baseLayer) => {
        if (baseLayer.params !== '_base') return

        // Get _base layer rules
        baseLayer.walkRules((baseRule) => {
          order.forEach((recipeName) => {
            if (!baseRule.selector.includes('.' + recipeName)) return
            if (!rulesByRecipeName.has(recipeName)) {
              rulesByRecipeName.set(recipeName, [])
            }
            const rules = rulesByRecipeName.get(recipeName)!
            rules.push(baseRule.clone())
            baseRule.remove()
          })
        })
      })

      // Get {layerName} rules
      layerRule.walkRules((rule) => {
        order.forEach((recipeName) => {
          if (!rule.selector.includes('.' + recipeName)) return
          if (!rulesByRecipeName.has(recipeName)) {
            rulesByRecipeName.set(recipeName, [])
          }
          const rules = rulesByRecipeName.get(recipeName)!
          rules.push(rule.clone())
          rule.remove()
        })
      })

      // Append the reordered rules to the layer
      // Recipe names that were not specified in the order will be at the top
      order.forEach((recipeName) => {
        const rules = rulesByRecipeName.get(recipeName)!
        layerRule.append(...rules)
      })
    })
  }
}
