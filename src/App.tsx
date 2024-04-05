import { center } from '../styled-system/patterns'
import { css } from './panda/css'

const className = css.tag`
padding: 10px;
font-size: 20px;
color: green;
background-color: token(colors.blue.100);
`

export const App = () => {
  return (
    <div className={center({ h: 'full' })}>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          fontWeight: 'semibold',
          color: 'yellow.300',
          textAlign: 'center',
          textStyle: '4xl',
        })}
      >
        <span>🐼</span>
        <span> Hello from Panda</span>
        <span className={className}>Using css.tag`xxx`</span>
      </div>
    </div>
  )
}
