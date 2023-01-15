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
  isHoverable?: boolean
  handleCardClick?: () => void
  handleMouseDown?: (card: CardType) => void
  handleMouseUpBefore?: (card: CardType) => void
  handleMouseUpAfter?: (card: CardType) => void
  handleMouseUp?: (card: CardType) => void
  handleHover?: (card: CardType, before: boolean) => void
}

export const CardTypeView: FC<CardTypeViewProps> = ({
  card,
  showPreview = false,
  noAddition = false,
  className = 'card',
  style = {},
  isHoverable = false,
  handleCardClick = () => {},
  handleMouseDown = () => {},
  handleMouseUpBefore = () => {},
  handleMouseUpAfter = () => {},
  handleMouseUp = () => {},
  handleHover
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

  const handleUpBefore = () => {
    handleMouseUpBefore(card)
  }

  const handleUpAfter = () => {
    handleMouseUpAfter(card)
  }

  const handleUp = () => {
    handleMouseUp(card)
  }

  const handleHoverBefore = () => {
    if(handleHover) {
      handleHover(card, true)
    }
  }

  const handleHoverAfter = () => {
    if(handleHover) {
      handleHover(card, false)
    }
  }

  return (
    <>
      {isHoverable && <div className='hoverZone' onMouseUp={handleUpBefore} onMouseEnter={handleHoverBefore}></div>}
      <div onClick={handleClick} onMouseDown={handleDown} onMouseUp={handleUp} style={style} className={className}>
        <div className='mainText'>{formatNumber(Number(count))}</div>
        {noAddition === false && <AdditionView card={card} />}
      </div>
      {noAddition === false && showPreview && <AdditionView card={card} showPreview />}
      {isHoverable && <div className='hoverZone' onMouseDown={handleUpAfter} onMouseEnter={handleHoverAfter}></div>}
    </>
  )
}
