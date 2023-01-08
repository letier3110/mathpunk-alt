import { CSSProperties, FC } from 'react'
import { CardType } from '../../math/CardType'
import { formatNumber } from '../../math/utils'
import { ItemTypes } from '../../shared/constants'
import { AdditionView } from '../AdditionView/AdditionView'

interface NavigatorViewProps {
  className?: string
  card: CardType
  style?: CSSProperties
  handleCardClick?: () => void
  handleMouseDown?: (card: CardType) => void
}

export const NavigatorTypeView: FC<NavigatorViewProps> = ({
  card,
  className = 'card',
  style = {},
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
    >
      <div className='mainText'>{name}</div>
    </div>
  )
}
