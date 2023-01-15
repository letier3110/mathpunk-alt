import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react'
import { CardsHand } from '../../components/CardsHand/CardsHand'
import { CardType } from '../../math/CardType'
import { GAME_MODES } from '../../math/math'
import { NavigatorCard } from '../../math/NavigatorCard'
import { useGhostPreviewContext } from '../../hooks/GhostPreview.constate'
import { useInventoryContext } from '../Inventory/Inventory.constate'
import { GhostPreview } from '../../components/GhostPreview/GhostPreview'
import { NavigatorTypeView } from '../../components/NavigatorTypeView/NavigatorTypeView'
import { useDeck } from '../../hooks/DeckState.constate'
import { LOAD_SAVES_NAME, NAVIGATION_POWER_NAME } from '../../shared/decks.data'
import { useGameModeContext } from '../../hooks/GameState.constate'

interface IntroProps {
  //
}

export const Intro: FC<IntroProps> = () => {
  const { addPower } = useInventoryContext()
  const { getDeck } = useDeck()
  const deck = getDeck(GAME_MODES.INTRO)
  const { selectedCard, setSelectedCard } = useGhostPreviewContext()
  const { powers, loadSave } = useInventoryContext()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [gatherPower, setGatherPower] = useState(false)

  const isPowerCollected = useMemo(() => gatherPower === true, [gatherPower])
  const commandLabel = useMemo(
    () => (isPowerCollected ? 'Scroll down to powers and drag it' : 'Drag card here to collect new power'),
    [isPowerCollected]
  )

  const handleCardClick = (card: NavigatorCard) => {
    if (card.getName() === NAVIGATION_POWER_NAME) {
      addPower(card)
      return
    }
    if (card.getName() === LOAD_SAVES_NAME) {
      loadSave()
      return
    }
  }

  const isPowersAdded = useMemo(() => powers.find((x) => x.getName() === NAVIGATION_POWER_NAME), [powers])

  useEffect(() => {
    if (isPowersAdded) {
      timerRef.current = setTimeout(() => {
        setGatherPower(true)
      }, 1000)
    }
    return () => {
      if (timerRef && timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isPowersAdded])

  return (
    <div className='root'>
      <div
        className={[selectedCard ? 'border' : '', isPowerCollected ? 'labelsShow' : '', 'flex flex1 aic jcc'].join(' ')}
        style={{
          backgroundColor: selectedCard ? 'rgba(0, 255, 0,.3)' : ''
        }}
        onMouseUp={() => {
          if (selectedCard) {
            handleCardClick(selectedCard)
            setSelectedCard(null)
          }
        }}
      >
        {commandLabel}
      </div>
      {selectedCard && (
        <GhostPreview
          deck={deck}
          card={selectedCard}
          isReward
          handleMouseUp={() => {
            if (selectedCard) {
              setSelectedCard(null)
            }
          }}
        />
      )}
      {!isPowerCollected && (
        <div
          className={[selectedCard ? 'border' : '', 'flex1'].join(' ')}
          style={{
            backgroundColor: selectedCard ? 'rgba(0, 255, 0,.3)' : ''
          }}
          onMouseUp={() => {
            if (selectedCard) {
              setSelectedCard(null)
            }
          }}
        >
          <CardsHand className={isPowersAdded ? 'cardsHide' : ''} keys={deck.map((x) => x.getId().toString())}>
            {deck.map((x) => {
              const isSelected = x.getId() === selectedCard?.getId()
              const style: CSSProperties = {
                scale: isSelected ? '1.2' : '1',
                zIndex: isSelected ? 200 : '',
                visibility: !isSelected ? 'visible' : 'hidden'
              }
              return (
                <NavigatorTypeView
                  key={x.getId()}
                  card={x}
                  handleCardClick={() => {
                    handleCardClick(x)
                  }}
                  isReward
                  style={style}
                  handleMouseDown={(card: CardType) =>
                    setSelectedCard((prev) => (prev?.getId() === card.getId() ? null : card))
                  }
                >
                  <div className='mainText'>{x.getName()}</div>
                </NavigatorTypeView>
              )
            })}
          </CardsHand>
        </div>
      )}
    </div>
  )
}
