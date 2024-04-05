import { defineConfig } from '@pandacss/dev'
import { astish, traverse } from '@pandacss/shared'
import type { Artifact, ArtifactContent, PandaHooks } from '@pandacss/types'
import { Node } from 'ts-morph'
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
    extend: { tokens, semanticTokens, recipes },
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
  //
  importMap: ['/styled-system', '/panda'],
  hooks: createHooks(),
  hash: true,
})

function createHooks(): Partial<PandaHooks> {
  const files = new Set<string>()

  return {
    // Removing every utility class so that both
    // `css({ })` and css.tag`xxx` will produce the same classes
    'config:resolved': (args) => {
      const { config } = args
      traverse(config.utilities ?? {}, (item) => {
        if (item.key === 'className') {
          // @ts-expect-error
          delete item.parent.className
        }
      })
    },
    // Export `css` context to get the hash state in `css.tag`
    'codegen:prepare': (args) => {
      onArtifactFile(args.artifacts, (artifact, content) => {
        if (
          artifact.dir?.includes('css') &&
          content.file.includes('css') &&
          !content.file.includes('ts') &&
          content.code
        ) {
          return content.code.replace('const context', 'export const context')
        }
      })
    },
    // Only traverse files with css.tag`xxx`
    'parser:before': (args) => {
      const content = args.content
      if (!content.includes('css.tag`')) return

      files.add(args.filePath)
    },
    // Extracting the css.tag`xxx` and add it to the parser result
    'parser:after': (args) => {
      if (!files.has(args.filePath)) return

      const parserResult = args.result
      if (!parserResult) return

      const all = parserResult?.all
      if (!all?.length) return

      const first = all[0]!
      const node = first.box?.getNode()
      if (!node) return

      const sourceFile = node.getSourceFile()
      sourceFile.forEachDescendant((node) => {
        if (Node.isTaggedTemplateExpression(node)) {
          const tag = node.getTag()
          const tagText = tag.getText()
          if (!tagText.includes('css.tag')) return

          const template = node.getTemplate()
          const literal = template.getText()
          // css` ... `
          const obj = astish(literal)
          parserResult.set('css', { data: [obj] })
        }
      })
    },
  }
}

const onArtifactFile = (artifacts: Artifact[], cb: (artifact: Artifact, content: ArtifactContent) => string | void) => {
  artifacts.forEach((artifact) =>
    artifact.files.forEach((content) => {
      const code = cb(artifact, content)
      if (code) content.code = code
    }),
  )
}
