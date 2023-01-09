import { CSSProperties, FC, ReactNode } from 'react'
import { CardType } from '../../math/CardType'
import { ItemTypes } from '../../shared/constants'

interface CardsHandProps {
  children: ReactNode[]
  className?: string | Array<string>
  styles?: Array<CSSProperties>
  keys?: string[]
  hide?: boolean
  handleMouseDown?: () => void
  handleMouseUp?: () => void
}

export const CardsHand: FC<CardsHandProps> = ({
  children,
  styles,
  className = '',
  keys,
  hide = false,
  handleMouseDown = () => {},
  handleMouseUp = () => {}
}) => {
  const height = Math.abs(-Math.floor(children.length / 2))
  if (hide) return null
  return (
    <div
      className={Array.isArray(className) ? className.join(' ') : ['cards', className].join(' ')}
      style={{
        height: `${height * height * 5 + 116}px`
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {children.map((Element, index, deck) => {
        const delta = Math.abs(-Math.floor(deck.length / 2) + index)
        const rotate = -Math.floor(deck.length / 2)
        const translateX = delta * delta * 5
        const translateY = index < deck.length / 2 ? delta * delta * 1.3 : -(delta * delta * 1.3)
        const currentStyle = styles && styles.length >= index ? styles[index] : undefined
        const style = {
          rotate: `${(rotate + index) * 6}deg`,
          margin: '0px -12px',
          translate: `${translateY}px ${translateX}px`,
          ...currentStyle
        }
        return (
          <div key={(keys ?? [(index = index)])[index]} style={style}>
            {Element}
          </div>
        )
      })}
    </div>
  )
}
