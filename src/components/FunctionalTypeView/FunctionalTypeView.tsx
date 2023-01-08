import { CSSProperties, FC, useMemo } from 'react'
import { instanceOfChangable, SwitcherValue } from '../../math/arithmetic'
import { FormulaeCardType } from '../../math/formulae'
import { Switcher } from '../../math/Switcher'
import { AdditionView } from '../AdditionView/AdditionView'
import { usePlottingContext } from '../../pages/Plotting/Plotting.constate'
import { CardType } from '../../math/CardType'

interface FunctionalTypeViewProps {
  className?: string
  card: FormulaeCardType
  showPreview?: boolean
  style?: CSSProperties
  handleCardClick?: () => void
  handleMouseDown?: (card: CardType) => void
  handleMouseUp?: (card: CardType) => void
}

export const FunctionalTypeView: FC<FunctionalTypeViewProps> = ({
  card,
  showPreview = false,
  className = 'card',
  style = {},
  handleCardClick = () => {},
  handleMouseDown = () => {},
  handleMouseUp = () => {}
}) => {
  // const count = card.getCount()
  const cardName = card.getName()
  const addition = card.getAddition()
  const isInteractiveAddition = useMemo(() => instanceOfChangable<SwitcherValue>(addition), [addition])

  const { chain, setChain } = usePlottingContext()

  const handleClick = () => {
    if (handleCardClick) {
      handleCardClick()
    }
  }

  const handleAdditionClick = () => {
    if (instanceOfChangable<SwitcherValue>(addition)) {
      const result = chain.map((x) => {
        if (x.getId() !== card.getId()) return x
        addition.setChangableState(addition.getNextPossibleValue())
        card.setAddition(addition)
        return card
      })
      setChain(result)
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
      <div style={style} className={className} onClick={handleClick} onMouseDown={handleDown} onMouseUp={handleUp}>
        <div className='mainText'>{cardName}</div>
        <AdditionView card={addition} />
      </div>
      {showPreview && (
        <AdditionView
          card={addition}
          showPreview
          interactive={isInteractiveAddition}
          handleAdditionClick={handleAdditionClick}
        />
      )}
    </>
  )
}
