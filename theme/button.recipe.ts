import { defineRecipe } from '../dev'

export const buttonRecipe = defineRecipe({
  className: 'button',
  description: 'The styles for the Button component',
  base: {
    display: 'flex',
    cursor: 'pointer',
    fontWeight: 'bold',
    _disabled: { opacity: '[0.5]' },
  },
  variants: {
    visual: {
      funky: { bg: 'red.200', color: 'slate.800' },
      edgy: { borderWidth: '[1px]', borderStyle: 'solid', borderColor: 'red.500' },
    },
    size: {
      sm: { padding: '4', fontSize: '[12px]' },
      lg: { padding: '8', fontSize: '[40px]' },
    },
    shape: {
      square: { borderRadius: '[0]' },
      circle: { borderRadius: 'full' },
    },
  },
  defaultVariants: {
    visual: 'funky',
    size: 'sm',
    shape: 'circle',
  },
})
