import { CSSProperties, FC } from 'react'
import { CardType } from '../../math/arithmetic'

interface AdditionViewProps {
  className?: string
  card: CardType
  showPreview?: boolean
  style?: CSSProperties
  handleAdditionClick?: () => void
}

export const AdditionView: FC<AdditionViewProps> = ({
  card,
  showPreview = false,
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

  return (
    <div
      className={[showPreview ? 'cardAddition' : 'addition', description, className].join(' ')}
      style={style}
      onClick={handleClick}
    >
      <div className='additionText'>{name}</div>
    </div>
  )
}
