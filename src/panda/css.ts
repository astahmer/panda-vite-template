import type { SystemStyleObject } from '../../styled-system/types/index'
// @ts-expect-error
import { css as pandaCss, mergeCss } from '../../styled-system/css'

import { createCss, isObject, mergeProps, withoutSpace } from '../../styled-system/helpers.mjs'
import { finalizeConditions, sortConditions } from '../../styled-system/css/conditions.mjs'

interface CssFunction {
  (...styles: Array<SystemStyleObject | undefined | null | false>): string
  raw: (...styles: Array<SystemStyleObject | undefined | null | false>) => SystemStyleObject
  tag: (args: { raw: readonly string[] | ArrayLike<string> }) => string
}

export const css: CssFunction = (...styles) => {
  console.log('css', styles)
  return pandaCss(...styles)
}
css.raw = (...styles) => mergeCss(...styles)
css.tag = (...styles) => cssFn(mergeProps(...styles.filter(Boolean).map(toObj)))

function transform(prop, value) {
  const className = `${prop}_${withoutSpace(value)}`
  return { className }
}

const context = {
  hash: false,
  conditions: {
    shift: sortConditions,
    finalize: finalizeConditions,
    breakpoints: { keys: [] },
  },
  utility: {
    prefix: undefined,
    transform,
    hasShorthand: false,
    toHash: (path, hashFn) => hashFn(path.join(':')),
    resolveShorthand(prop) {
      return prop
    },
  },
}

const newRule = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g
const ruleClean = /\/\*[^]*?\*\/|  +/g
const ruleNewline = /\n+/g
const empty = ' '

const astish = (val: string, tree: any[] = [{}]): Record<string, any> => {
  if (!val) return tree[0]
  let block, left
  while ((block = newRule.exec(val.replace(ruleClean, '')))) {
    if (block[4]) tree.shift()
    else if (block[3]) {
      left = block[3].replace(ruleNewline, empty).trim()
      tree.unshift((tree[0][left] = tree[0][left] || {}))
    } else tree[0][block[1]] = block[2].replace(ruleNewline, empty).trim()
  }

  return tree[0]
}

const cssFn = createCss(context)
const toObj = (style) => (isObject(style) ? style : astish(style[0]))
// css.raw = (...styles) => mergeProps(...styles.filter(Boolean).map(fn))
