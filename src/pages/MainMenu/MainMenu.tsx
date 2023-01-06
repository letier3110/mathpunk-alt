import { CSSProperties, FC, RefObject, useEffect, useRef, useState } from 'react'

import { CardsHand } from '../../components/CardsHand/CardsHand'

import { GAME_MODES } from '../../math/math'
import { useGameModeContext } from '../../shared/GameState.constate'

import { Navigator } from '../../math/Navigator'
import { NavigatorTypeView } from '../../components/NavigatorTypeView/NavigatorTypeView'
import { MainMenuLoader } from './MainMenuLoader'
import { CardType } from '../../math/arithmetic'

interface GhostPreviewProps {
  card: CardType
  deck: Array<Navigator>
}

const GhostPreview: FC<GhostPreviewProps> = ({ card, deck }) => {
  // const preview = usePreview()
  // if (!preview.display) {
  //   return null
  // }
  // const { itemType, style } = preview
  // const item = preview.item as CardType

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
        const isSelected = x.getDescription() === card?.getDescription()
        return isSelected ? { position: 'fixed', top: '0px', left: '0px', rotate: '0deg' } : {}
      })}
    >
      {deck
        // .filter((x) => x.getDescription() !== selectedCard?.getDescription())
        .map((x) => {
          const isSelected = x.getDescription() === card?.getDescription()
          const style: CSSProperties = {
            // scale: isSelected ? '1.2' : '1',
            zIndex: isSelected ? 200 : '',
            // visibility: isSelected ? 'visible' : 'hidden',
            visibility: 'hidden',
            position: isSelected ? 'absolute' : 'relative'
          }
          return (
            <div key={x.getId().toString()} className='card hideCard ghostCard' style={style} ref={isSelected ? cardRef : null}>
              {card.getDescription()}
            </div>
          )
        })}
    </CardsHand>
  )
  // return null
}
interface MainMenuProps {
  //
}

const TUTORIAL_NAME = 'Start Tutorial?'
const ARITHMETIC_NAME = 'Start Arithmetic?'
const PLOTTING_NAME = 'Start Plotting?'
const DUEL_NAME = 'Start Duel?'

export const MainMenu: FC<MainMenuProps> = () => {
  const { setGameMode } = useGameModeContext()
  const [gameModeState, setGameModeState] = useState(GAME_MODES.MAIN_MENU)
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const deck = [
    // new Navigator('Continue')
    new Navigator(TUTORIAL_NAME),
    new Navigator(ARITHMETIC_NAME),
    new Navigator(PLOTTING_NAME),
    new Navigator(DUEL_NAME)
  ]

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
          // className={''}
          style={{
            backgroundColor: selectedCard ? 'rgba(255,120,70,.1)' : ''
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
      {selectedCard && <GhostPreview deck={deck} card={selectedCard} />}
      <div
        style={{
          backgroundColor: selectedCard ? 'rgba(255,120,70,.1)' : ''
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
          {deck
            // .filter((x) => x.getDescription() !== selectedCard?.getDescription())
            .map((x) => {
              const isSelected = x.getDescription() === selectedCard?.getDescription()
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
                  // style={{ backgroundColor: x.getDescription() === selectedCard?.getDescription() ? 'red' : '' }}
                  handleMouseDown={(card: CardType) =>
                    setSelectedCard((prev) => (prev?.getDescription() === card.getDescription() ? null : card))
                  }
                />
              )
            })}
        </CardsHand>
      </div>
    </div>
  )
}
