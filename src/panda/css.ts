import type { SystemStyleObject } from '../../styled-system/types/index'
import { css as pandaCss } from '../../styled-system/css/css'
import { cssTag } from './css.tag'

interface CssFunction {
  (...styles: Array<SystemStyleObject | undefined | null | false>): string
  raw: (...styles: Array<SystemStyleObject | undefined | null | false>) => SystemStyleObject
  tag: (args: { raw: readonly string[] | ArrayLike<string> }) => string
}

// @ts-expect-error
export const css: CssFunction = pandaCss

css.raw = pandaCss.raw
css.tag = cssTag
