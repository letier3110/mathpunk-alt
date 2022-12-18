import { FC, ReactNode } from 'react'

interface CardsHandProps {
  children: ReactNode[]
  className?: string
  keys?: string[]
}

export const CardsHand: FC<CardsHandProps> = ({ children, className = '', keys }) => {
  const height = Math.abs(-Math.floor(children.length / 2))
  return (
    <div
      className={['cards', className].join(' ')}
      style={{
        height: `${height * height * 5 + 116}px`
      }}
    >
      {children.map((Element, index, deck) => {
        const delta = Math.abs(-Math.floor(deck.length / 2) + index)
        const rotate = -Math.floor(deck.length / 2)
        const translateX = delta * delta * 5
        const translateY = index < deck.length / 2 ? delta * delta * 1.3 : -(delta * delta * 1.3)
        const style = {
          rotate: `${(rotate + index) * 6}deg`,
          margin: '0px -12px',
          translate: `${translateY}px ${translateX}px`
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
