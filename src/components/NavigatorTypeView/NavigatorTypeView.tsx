import { CSSProperties, FC } from 'react'
import { useDrag } from 'react-dnd'
import { CardType } from '../../math/arithmetic'
import { formatNumber } from '../../math/utils'
import { ItemTypes } from '../../shared/constants'
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
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: card,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging()
      })
    }),
    []
  )

  const name = card.getName()

  const handleClick = () => {
    if (handleCardClick) {
      handleCardClick()
    }
  }

  return (
    <div
      ref={drag}
      style={{
        ...style,
        opacity: isDragging ? 0 : 1
      }}
      className={className}
      onClick={handleClick}
    >
      <div className='mainText'>{name}</div>
    </div>
  )
}
