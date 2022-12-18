import { FC, ReactNode } from 'react'

interface CardsHandProps {
  children: ReactNode[]
  keys?: string[]
}

export const CardsHand: FC<CardsHandProps> = ({ children, keys }) => {
  return (
    <div className='cards'>
      {children.map((Element, index, deck) => {
        const translateY = Math.abs(-Math.floor(deck.length / 2) + index)
        const rotate = -Math.floor(deck.length / 2)
        const style = {
          rotate: `${(rotate + index) * 10}deg`,
          translate: `0px ${translateY * translateY * 12}px`
        }
        return <div key={(keys ?? [index = index])[index]} style={style}>{Element}</div>
      })}
    </div>
  )
}
