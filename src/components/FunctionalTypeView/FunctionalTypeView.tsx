import { CSSProperties, FC, useMemo } from 'react'
import { instanceOfChangable, SwitcherValue } from '../../math/arithmetic'
import { FormulaeCardType } from '../../math/formulae'
import { Switcher } from '../../math/Switcher'
import { AdditionView } from '../AdditionView/AdditionView'
import { usePlottingContext } from '../Plotting/Plotting.constate'

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

  return (
    <>
      <div onClick={handleClick} style={style} className={className}>
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
