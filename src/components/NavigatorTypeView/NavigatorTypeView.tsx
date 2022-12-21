import { CSSProperties, FC } from 'react'
import { CardType } from '../../math/arithmetic'
import { formatNumber } from '../../math/utils'
import { AdditionView } from '../AdditionView/AdditionView'

interface NavigatorViewProps {
  className?: string
  card: CardType
  style?: CSSProperties
  handleCardClick?: () => void
}

export const NavigatorTypeView: FC<NavigatorViewProps> = ({
  card,
  className = 'card',
  style = {},
  handleCardClick
}) => {
  const name = card.getName()

  const handleClick = () => {
    if (handleCardClick) {
      handleCardClick()
    }
  }

  return (
    <div onClick={handleClick} style={style} className={className}>
      <div className='mainText'>{name}</div>
    </div>
  )
}
