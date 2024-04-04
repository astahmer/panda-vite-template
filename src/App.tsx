// import { css } from '../styled-system/css'
// import { css } from '../styled-system/css'
import { center } from '../styled-system/patterns'
import { css } from './panda/css'

const className = css.tag`
padding: 10px;
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
        <span className={className}>Hello from Panda</span>
      </div>
    </div>
  )
}
