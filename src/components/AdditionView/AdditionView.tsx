import { CSSProperties, FC } from 'react'
import { CardType } from '../../math/CardType'
import { OperatorCard } from '../../math/OperatorCard'
import { VectorCard } from '../../math/VectorCard'

interface AdditionViewProps {
  className?: string
  card: OperatorCard
  showPreview?: boolean
  interactive?: boolean
  style?: CSSProperties
  handleAdditionClick?: () => void
}

export const AdditionView: FC<AdditionViewProps> = ({
  card,
  showPreview = false,
  interactive = false,
  className = '',
  style = {},
  handleAdditionClick
}) => {
  const description = card.getDescription()
  const name = card.getName()

  const handleClick = () => {
    if (handleAdditionClick) {
      handleAdditionClick()
    }
  }

  const previewClass = showPreview ? 'cardAddition' : 'addition'
  const noDropClass = showPreview ? (!interactive ? 'noDrop' : 'activeCardAddition') : ''
  const interactiveClass = card.getIsInteractive() ? 'additionAnim' : ''

  return (
    <div
      className={[previewClass, noDropClass, description, interactiveClass, className].join(' ')}
      style={style}
      onClick={handleClick}
    >
      <div className={['additionText'].join(' ')}>{name}</div>
    </div>
  )
}
