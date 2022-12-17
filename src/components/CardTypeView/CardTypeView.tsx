import { CSSProperties, FC } from 'react'
import { CardType } from '../../math/arithmetic'
import { AdditionView } from '../AdditionView/AdditionView'

interface CardTypeViewProps {
  className?: string
  card: CardType
  showPreview?: boolean
  style?: CSSProperties
  handleCardClick?: () => void
}

export const CardTypeView: FC<CardTypeViewProps> = ({
  card,
  showPreview = false,
  className = 'card',
  style = {},
  handleCardClick
}) => {
  const count = card.getCount()
  const description = card.getDescription()
  const name = card.getName()

  const handleClick = () => {
    if (handleCardClick) {
      handleCardClick()
    }
  }

  return (
    <>
      <div onClick={handleClick} style={style} className={className}>
        <div className='mainText'>{count}</div>
        <AdditionView card={card} />
      </div>
      {showPreview && <AdditionView card={card} showPreview />}
    </>
  )
}