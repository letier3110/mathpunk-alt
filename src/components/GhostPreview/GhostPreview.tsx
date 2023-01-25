import { CSSProperties, FC, useEffect, useRef } from 'react'
import { CardType } from '../../math/CardType'
import { VectorCard } from '../../math/VectorCard'
import { getCoords } from '../../util'
import { CardsHand } from '../CardsHand/CardsHand'
import { RewardEffect } from '../RewardEffect/RewardEffect'

interface GhostPreviewProps {
  card: CardType | VectorCard
  className?: string
  deck: Array<CardType | VectorCard>
  isReward?: boolean
  showField?: 'description' | 'count' | 'name'
  handleMouseDown?: () => void
  handleMouseUp?: () => void
}

export const GhostPreview: FC<GhostPreviewProps> = ({
  card,
  deck,
  showField = 'description',
  isReward = false,
  handleMouseDown = () => {},
  handleMouseUp = () => {}
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const handRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mouseMoveHandler = (e: MouseEvent) => {
      if (!card) return
      if (!cardRef.current) return
      if (!handRef.current) return
      // const { top } = getCoords(e.target)
      const { top } = getCoords(handRef.current)
      // console.log(e.pageY, window.scrollY, top)
      // console.log(handRef.current.getBoundingClientRect().top)
      const x = e.pageX
      // console.log(e.offsetX)
      // const y = e.pageY
      const y = e.pageY - window.scrollY
      // const y = e.pageY - window.scrollY - top
      // const y = e.pageY - (top - window.scrollY)
      // const y = e.pageY - (top) + window.scrollY
      // const y = (top) + window.scrollY
      // const y = e.pageY
      // const y = top
      const newposX = x - 60
      const newposY = y - 120
      cardRef.current.style.transform = `matrix(1, 0, 0, 1, ${newposX},${newposY})`
      // cardRef.current.style.top = `${newposY}px`
      // cardRef.current.style.left = `${newposX}px`
      cardRef.current.style.rotate = `0deg`
      cardRef.current.style.visibility = `visible`
      // cardRef.current.style.position = `fixed`
      cardRef.current.style.pointerEvents = `none`
    }
    document.addEventListener('mousemove', mouseMoveHandler)
    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler)
    }
  }, [card])

  return (
    <CardsHand
      className={['ghostHand']}
      ref={handRef}
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
              {isReward && <RewardEffect />}
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
