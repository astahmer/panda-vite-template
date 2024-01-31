import { css } from '../styled-system/css'
import { center } from '../styled-system/patterns'

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
        <span>Hello from Panda</span>
      </div>
    </div>
  )
}
