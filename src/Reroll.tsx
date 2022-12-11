import { FC } from 'react'

interface RerollProps {
  left: number
  handleReroll: () => void
}

export const Reroll: FC<RerollProps> = ({ left, handleReroll }) => {
  return (
      <div className='reroll'>
        <div className={['card', left <= 0 ? 'cardDisabled' : ''].join(' ')} onClick={handleReroll}>
          reroll? {left} left
        </div>
      </div>
  )
}
