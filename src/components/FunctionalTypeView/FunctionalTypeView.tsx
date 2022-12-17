import { CSSProperties, FC } from 'react'
import { FormulaeCardType } from '../../math/formulae'
import { AdditionView } from '../AdditionView/AdditionView'

interface FunctionalTypeViewProps {
  className?: string
  card: FormulaeCardType
  showPreview?: boolean
  style?: CSSProperties
  handleCardClick?: () => void
}

export const FunctionalTypeView: FC<FunctionalTypeViewProps> = ({
  card,
  showPreview = false,
  className = 'card',
  style = {},
  handleCardClick
}) => {
  // const count = card.getCount()
  const cardName = card.getName()
  const addition = card.getAddition()

  const handleClick = () => {
    if (handleCardClick) {
      handleCardClick()
    }
  }

  return (
    <>
      <div onClick={handleClick} style={style} className={className}>
        <div className='mainText'>{cardName}</div>
        <AdditionView card={addition} />
      </div>
      {showPreview && <AdditionView card={card} showPreview />}
    </>
  )
}
