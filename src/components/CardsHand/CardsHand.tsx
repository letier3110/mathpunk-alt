import { FC, ReactNode } from 'react'
import { DragPreviewImage, useDrag } from 'react-dnd'
import { ItemTypes } from '../../shared/constants'

interface CardsHandProps {
  children: ReactNode[]
  className?: string
  keys?: string[]
  hide?: boolean
}

export const CardsHand: FC<CardsHandProps> = ({ children, className = '', keys, hide = false }) => {
  const height = Math.abs(-Math.floor(children.length / 2))
  if (hide) return null
  return (
    <div
      className={['cards', className].join(' ')}
      style={{
        height: `${height * height * 5 + 116}px`
      }}
    >
      {children.map((Element, index, deck) => {
        // const [{ opacity }, dragRef] = useDrag(
        //   () => ({
        //     type: ItemTypes.CARD,
        //     item: { card: deck[index] },
        //     collect: (monitor) => ({
        //       opacity: monitor.isDragging() ? 0.5 : 1
        //     })
        //   }),
        //   []
        // )
        const delta = Math.abs(-Math.floor(deck.length / 2) + index)
        const rotate = -Math.floor(deck.length / 2)
        const translateX = delta * delta * 5
        const translateY = index < deck.length / 2 ? delta * delta * 1.3 : -(delta * delta * 1.3)
        const style = {
          rotate: `${(rotate + index) * 6}deg`,
          margin: '0px -12px',
          translate: `${translateY}px ${translateX}px`,
          // opacity,
          // opacity: isDragging ? 0.5 : 1
        }
        // if (isDragging) {
        //   return (<div key={(keys ?? [(index = index)])[index]} ref={drag}>{Element}</div>)
        // }
        return (
          <div key={(keys ?? [(index = index)])[index]} style={style}>
            {Element}
          </div>
        )
      })}
    </div>
  )
}
