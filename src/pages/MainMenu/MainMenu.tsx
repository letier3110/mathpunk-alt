import { FC, useEffect, useRef, useState } from 'react'
import type { DropTargetMonitor } from 'react-dnd'

import { CardsHand } from '../../components/CardsHand/CardsHand'

import { GAME_MODES } from '../../math/math'
import { useGameModeContext } from '../../shared/GameState.constate'

import { Navigator } from '../../math/Navigator'
import { NavigatorTypeView } from '../../components/NavigatorTypeView/NavigatorTypeView'
import { MainMenuLoader } from './MainMenuLoader'
import { useDrop } from 'react-dnd'
import { ItemTypes } from '../../shared/constants'
import { CardType } from '../../math/arithmetic'
import { usePreview } from 'react-dnd-preview'

const GhostPreview = () => {
  const preview = usePreview()
  if (!preview.display) {
    return null
  }
  const { itemType, style } = preview
  const item = preview.item as CardType
  return (
    <div className='card' style={style}>
      {item.getDescription()}
    </div>
  )
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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const deck = [
    // new Navigator('Continue')
    new Navigator(TUTORIAL_NAME),
    new Navigator(ARITHMETIC_NAME),
    new Navigator(PLOTTING_NAME),
    new Navigator(DUEL_NAME)
  ]

  const canDropHandle = () => {
    return true
  }

  const dropHandle = (e: CardType) => {
    // game.moveKnight(x, y)
    handleCardClick(e);
    console.log('dropped something', e)
  }

  const collectHandle = (monitor: DropTargetMonitor) => ({
    isOver: !!monitor.isOver(),
    canDrop: !!monitor.canDrop()
  })

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      canDrop: canDropHandle,
      drop: dropHandle,
      collect: collectHandle
    }),
    []
  )

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
      <div
        style={{
          background: !isOver && canDrop ? '#fa5' : ''
        }}
        role='Space'
        ref={drop}
        className='flex flex1 aic jcc'
      >
        <MainMenuLoader />
      </div>
      <GhostPreview />
      <CardsHand
        className={gameModeState !== GAME_MODES.MAIN_MENU ? 'cardsHide' : ''}
        keys={deck.map((x) => x.getId().toString())}
      >
        {deck.map((x) => (
          <NavigatorTypeView
            key={x.getId()}
            card={x}
            handleCardClick={() => {
              handleCardClick(x)
            }}
          />
        ))}
      </CardsHand>
    </div>
  )
}
