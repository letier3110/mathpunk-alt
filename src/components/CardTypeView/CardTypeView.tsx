import { CSSProperties, FC } from 'react'
import { CardType } from '../../math/CardType'
import { formatNumber } from '../../math/utils'
import { AdditionView } from '../AdditionView/AdditionView'

interface CardTypeViewProps {
  className?: string
  card: CardType
  showPreview?: boolean
  noAddition?: boolean
  style?: CSSProperties
  handleCardClick?: () => void
  handleMouseDown?: (card: CardType) => void
  handleMouseUp?: (card: CardType) => void
}

export const CardTypeView: FC<CardTypeViewProps> = ({
  card,
  showPreview = false,
  noAddition = false,
  className = 'card',
  style = {},
  handleCardClick = () => {},
  handleMouseDown = () => {},
  handleMouseUp = () => {}
}) => {
  const count = card.getCount()
  const description = card.getDescription()
  const name = card.getName()

  const handleClick = () => {
    if (handleCardClick) {
      handleCardClick()
    }
  }

  const handleDown = () => {
    handleMouseDown(card)
  }

  const handleUp = () => {
    handleMouseUp(card)
  }

  return (
    <>
      <div onClick={handleClick} onMouseDown={handleDown} onMouseUp={handleUp} style={style} className={className}>
        <div className='mainText'>{formatNumber(Number(count))}</div>
        {noAddition === false && <AdditionView card={card} />}
      </div>
      {noAddition === false && showPreview && <AdditionView card={card} showPreview />}
    </>
  )
}
