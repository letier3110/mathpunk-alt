import { CSSProperties, FC, useEffect, useRef } from 'react'
import { CardType } from '../../math/CardType'
import { CardsHand } from '../CardsHand/CardsHand'

interface GhostPreviewProps {
  card: CardType
  deck: Array<CardType>
  showField?: 'description' | 'count' | 'name'
  handleMouseDown?: () => void
  handleMouseUp?: () => void
}

export const GhostPreview: FC<GhostPreviewProps> = ({
  card,
  deck,
  showField = 'description',
  handleMouseDown = () => {},
  handleMouseUp = () => {}
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mouseMoveHandler = (e: MouseEvent) => {
      if (!card) return
      if (!cardRef.current) return
      const x = e.pageX
      const y = e.pageY
      const newposX = x - 60
      const newposY = y + 60
      cardRef.current.style.transform = `matrix(1.2, 0, 0, 1.2, ${newposX},${newposY})`
      cardRef.current.style.rotate = `0deg`
      cardRef.current.style.visibility = `visible`
    }
    document.addEventListener('mousemove', mouseMoveHandler)
    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler)
    }
  }, [card])

  return (
    <CardsHand
      className={['ghostHand']}
      keys={deck.map((x) => x.getId().toString())}
      styles={deck.map((x) => {
        const isSelected = x.getId().toString() === card?.getId().toString()
        return isSelected ? { position: 'fixed', top: '0px', left: '0px', rotate: '0deg', zIndex: 200 } : {}
      })}
      handleMouseDown={handleMouseDown}
      handleMouseUp={handleMouseUp}
    >
      {deck
        // .filter((x) => x.getDescription() !== selectedCard?.getDescription())
        .map((x) => {
          const isSelected = x.getId().toString() === card?.getId().toString()
          const style: CSSProperties = {
            // scale: isSelected ? '1.2' : '1',
            zIndex: isSelected ? 200 : '',
            // visibility: isSelected ? 'visible' : 'hidden',
            visibility: 'hidden',
            position: isSelected ? 'absolute' : 'relative'
          }
          return (
            <div
              key={x.getId().toString()}
              className='card hideCard ghostCard'
              style={style}
              ref={isSelected ? cardRef : null}
            >
              {showField === 'description'
                ? card.getDescription()
                : showField === 'name'
                ? card.getName()
                : card.getCount()}
            </div>
          )
        })}
    </CardsHand>
  )
  // return null
}
