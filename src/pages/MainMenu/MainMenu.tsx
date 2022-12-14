import { CSSProperties, FC, RefObject, useEffect, useMemo, useRef, useState } from 'react'

import { CardsHand } from '../../components/CardsHand/CardsHand'

import { GAME_MODES } from '../../math/math'
import { useGameModeContext } from '../../shared/GameState.constate'

import { Navigator } from '../../math/Navigator'
import { NavigatorTypeView } from '../../components/NavigatorTypeView/NavigatorTypeView'
import { MainMenuLoader } from './MainMenuLoader'
import { CardType } from '../../math/CardType'
import { GhostPreview } from '../../components/GhostPreview/GhostPreview'
import { useGhostPreviewContext } from '../../shared/GhostPreview.constate'

interface MainMenuProps {
  //
}

const TUTORIAL_NAME = 'Start Tutorial?'
const ARITHMETIC_NAME = 'Start Arithmetic?'
const PLOTTING_NAME = 'Start Plotting?'
const DUEL_NAME = 'Start Duel?'

const deck = [
  // new Navigator('Continue')
  new Navigator(TUTORIAL_NAME),
  new Navigator(ARITHMETIC_NAME),
  new Navigator(PLOTTING_NAME),
  new Navigator(DUEL_NAME)
]

export const MainMenu: FC<MainMenuProps> = () => {
  const { setGameMode } = useGameModeContext()
  const [gameModeState, setGameModeState] = useState(GAME_MODES.MAIN_MENU)
  const { selectedCard, setSelectedCard } = useGhostPreviewContext()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCardClick = (card: Navigator) => {
    if (card.getName() === TUTORIAL_NAME) {
      setGameModeState(GAME_MODES.TUTORIAL)
      return
    }
    if (card.getName() === ARITHMETIC_NAME) {
      setGameModeState(GAME_MODES.ARITHMETICS)
      return
    }
    if (card.getName() === PLOTTING_NAME) {
      setGameModeState(GAME_MODES.PLOTTING)
      return
    }
    if (card.getName() === DUEL_NAME) {
      setGameModeState(GAME_MODES.DUEL_FUNCTION)
      return
    }
  }

  useEffect(() => {
    if (gameModeState !== GAME_MODES.MAIN_MENU) {
      timerRef.current = setTimeout(() => {
        setGameMode(gameModeState)
      }, 1100)
    }
    return () => {
      if (timerRef && timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [gameModeState])

  return (
    <div className='root'>
      <div className='flex flex1 aic jcc'>
        <div
          className={[selectedCard ? 'border' : ''].join(' ')}
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
          <MainMenuLoader />
        </div>
      </div>
      {selectedCard && (
        <GhostPreview
          deck={deck}
          card={selectedCard}
          handleMouseUp={() => {
            if (selectedCard) {
              setSelectedCard(null)
            }
          }}
        />
      )}
      <div
        className={[selectedCard ? 'border' : ''].join(' ')}
        style={{
          backgroundColor: selectedCard ? 'rgba(0, 255, 0,.3)' : ''
        }}
        onMouseUp={() => {
          if (selectedCard) {
            setSelectedCard(null)
          }
        }}
      >
        <CardsHand
          className={gameModeState !== GAME_MODES.MAIN_MENU ? 'cardsHide' : ''}
          keys={deck.map((x) => x.getId().toString())}
        >
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
                style={style}
                handleMouseDown={(card: CardType) =>
                  setSelectedCard((prev) => (prev?.getId() === card.getId() ? null : card))
                }
              />
            )
          })}
        </CardsHand>
      </div>
    </div>
  )
}
