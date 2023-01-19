import { CSSProperties, FC, ReactNode } from 'react'
import { CardType } from '../../math/CardType'
import { formatNumber } from '../../math/utils'
import { ItemTypes } from '../../shared/constants'
import { AdditionView } from '../AdditionView/AdditionView'
import { RewardEffect } from '../RewardEffect/RewardEffect'

interface NavigatorViewProps {
  className?: string
  card: CardType
  style?: CSSProperties
  isReward?: boolean
  children: ReactNode
  handleCardClick?: () => void
  handleMouseDown?: (card: CardType) => void
}

export const NavigatorTypeView: FC<NavigatorViewProps> = ({
  card,
  className = 'card',
  isReward = false,
  style = {},
  children,
  handleCardClick = () => {},
  handleMouseDown = () => {}
}) => {
  const name = card.getName()

  const handleClick = () => {
    handleCardClick()
  }

  const handleDown = () => {
    handleMouseDown(card)
  }

  return (
    <div
      style={{
        ...style
      }}
      className={className}
      onClick={handleClick}
      onMouseDown={handleDown}
      onTouchStart={handleCardClick}
    >
      {isReward && <RewardEffect />}
      {children}
    </div>
  )
}
