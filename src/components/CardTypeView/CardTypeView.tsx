import { CSSProperties, FC } from 'react'
import { CardType } from '../../math/arithmetic'
import { AdditionView } from '../AdditionView/AdditionView'

interface CardTypeViewProps {
  className?: string
  card: CardType
  showPreview?: boolean
  noAddition?: boolean
  style?: CSSProperties
  handleCardClick?: () => void
}

export const CardTypeView: FC<CardTypeViewProps> = ({
  card,
  showPreview = false,
  noAddition = false,
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
        {noAddition === false && (<AdditionView card={card} />)}
      </div>
      {noAddition === false && showPreview && <AdditionView card={card} showPreview />}
    </>
  )
}
