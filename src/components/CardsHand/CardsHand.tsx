import { FC, ReactNode } from 'react'
import { AdditionView } from '../../components/AdditionView/AdditionView'
import { CardTypeView } from '../../components/CardTypeView/CardTypeView'
import { GAME_MODES } from '../../math/math'
import { Numberator } from '../../math/Numberator'
import { Summator } from '../../math/Summator'

interface CardsHandProps {
  children: ReactNode[]
}

export const CardsHand: FC<CardsHandProps> = ({ children }) => {
  return (
    <div className='cards'>
      {children.map((Element, index, deck) => {
        const translateY = Math.abs(-Math.floor(deck.length / 2) + index)
        const rotate = -Math.floor(deck.length / 2)
        const style = {
          rotate: `${(rotate + index) * 10}deg`,
          translate: `0px ${translateY * translateY * 12}px`
        }
        return <div style={style}>{Element}</div>
      })}
    </div>
  )
}
