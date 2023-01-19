import { CSSProperties, FC } from 'react'
import { CardType } from '../../math/CardType'
import { RewardEffect } from '../RewardEffect/RewardEffect'

interface RerollProps {
  className?: string
  left: number
  style?: CSSProperties
  handleReroll?: () => void
  handleMouseDown?: () => void
}

export const Reroll: FC<RerollProps> = ({
  className = 'card',
  left,
  style = {},
  handleReroll = () => {},
  handleMouseDown = () => {}
}) => {
  const handleDown = () => {
    if (left > 0) {
      handleMouseDown()
    }
  }

  return (
    <div
      className={[className, left <= 0 ? 'cardDisabled' : ''].join(' ')}
      style={style}
      onClick={handleReroll}
      onMouseDown={handleDown}
      onTouchStart={handleReroll}
    >
      <RewardEffect />
      reroll? {left} left
    </div>
  )
}
