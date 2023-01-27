import { CSSProperties, FC, useMemo } from 'react'
import { useChainContext } from '../../hooks/Chain.constate'
import { instanceOfChangable, SwitcherValue } from '../../math/arithmetic'
import { CardType } from '../../math/CardType'
import { OperatorCard } from '../../math/OperatorCard'
import { formatNumber } from '../../math/utils'
import { VectorCard } from '../../math/VectorCard'
import { AdditionView } from '../AdditionView/AdditionView'
import { ArrayNumber } from '../ArrayNumber/ArrayNumber'
import { ColorSquare, vectorCardToColor } from '../ColorSquare/ColorSquare'

interface ColorCardTypeViewProps {
  className?: string
  operator: OperatorCard
  showPreview?: boolean
  noAddition?: boolean
  style?: CSSProperties
  isHoverable?: boolean
  handleCardClick?: () => void
  handleMouseDown?: (card: VectorCard) => void
  handleMouseUpBefore?: (card: VectorCard) => void
  handleMouseUpAfter?: (card: VectorCard) => void
  handleMouseUp?: (card: VectorCard) => void
  handleHover?: (card: VectorCard, before: boolean) => void
}

export const ColorCardTypeView: FC<ColorCardTypeViewProps> = ({
  operator,
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
  const card = operator.getCard() as VectorCard
  // const count = card.getCount()
  // const size = card.getSize()
  // const description = card.getDescription()
  // const name = card.getName()

  const isInteractiveAddition = useMemo(() => instanceOfChangable<SwitcherValue>(card), [card])

  const { chain, setChain } = useChainContext()

  const handleAdditionClick = () => {
    if (instanceOfChangable<SwitcherValue>(card)) {
      const result = chain.map((x) => {
        if (x.getId() !== card.getId()) return x
        card.setChangableState(card.getNextPossibleValue())
        return card
      })
      setChain(result)
    }
  }

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
    if (handleHover) {
      handleHover(card, true)
    }
  }

  const handleHoverAfter = () => {
    if (handleHover) {
      handleHover(card, false)
    }
  }

  return (
    <>
      {isHoverable && <div className='hoverZone' onMouseUp={handleUpBefore} onMouseEnter={handleHoverBefore}></div>}
      <div
        onClick={handleClick}
        onTouchStart={handleClick}
        onMouseDown={handleDown}
        onMouseUp={handleUp}
        style={style}
        className={className}
      >
        {/* <div className='mainText'>{formatNumber(Number(count))}</div> */}
        {card.getSize() === 3 ? <ColorSquare color={vectorCardToColor(card)} /> : <ArrayNumber item={card} />}
        {noAddition === false && (
          <AdditionView
            interactive={isInteractiveAddition}
            handleAdditionClick={handleAdditionClick}
            card={operator}
          />
        )}
      </div>
      {noAddition === false && showPreview && <AdditionView card={operator} showPreview />}
      {isHoverable && <div className='hoverZone' onMouseDown={handleUpAfter} onMouseEnter={handleHoverAfter}></div>}
    </>
  )
}
