import { astish, createCss, mergeProps, withoutSpace, isObject } from '@pandacss/shared'
// @ts-expect-error
import { context } from '../../styled-system/css/css'

interface CssTagFn {
  (args: { raw: readonly string[] | ArrayLike<string> }): string
}

export const cssTag: CssTagFn = (...styles) =>
  cssFn(mergeProps(...styles.filter(Boolean).map((style) => (isObject(style) ? style : astish(style[0])))))

const condRegex = /^@|&|&$/
const selectorRegex = /&|@/

const isCondition = (val: string) => condRegex.test(val)

const finalizeConditions = (paths: string[]) =>
  paths.map((path) => (selectorRegex.test(path) ? `[${withoutSpace(path.trim())}]` : path))

function sortConditions(paths: string[]) {
  return paths.sort((a, b) => {
    const aa = isCondition(a)
    const bb = isCondition(b)
    if (aa && !bb) return 1
    if (!aa && bb) return -1
    return 0
  })
}

const cssFn = createCss({
  hash: context.hash,
  // @ts-expect-error
  prefix: context.prefix,
  conditions: {
    shift: sortConditions,
    finalize: finalizeConditions,
    breakpoints: { keys: [] },
  },
  utility: {
    prefix: '',
    transform: (prop: string, value) => {
      const className = `${prop}_${withoutSpace(value)}`
      return { className }
    },
    hasShorthand: false,
    toHash: (path, hashFn) => hashFn(path.join(':')),
    resolveShorthand(prop) {
      return prop
    },
  },
})
