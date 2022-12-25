import { FC, useEffect, useRef, useState } from 'react'
import { CardsHand } from '../../components/CardsHand/CardsHand'

import { GAME_MODES } from '../../math/math'
import { useGameModeContext } from '../../shared/GameState.constate'

import { Navigator } from '../../math/Navigator'
import { NavigatorTypeView } from '../../components/NavigatorTypeView/NavigatorTypeView'
import { MainMenuLoader } from './MainMenuLoader'

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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deck = [
    // new Navigator('Continue')
    new Navigator(TUTORIAL_NAME),
    new Navigator(ARITHMETIC_NAME),
    new Navigator(PLOTTING_NAME),
    new Navigator(DUEL_NAME)
  ]

  const handleCardClick = (card:Navigator) => {
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
    if(gameModeState !== GAME_MODES.MAIN_MENU) {
      timerRef.current = setTimeout(() => {
        setGameMode(gameModeState);
      }, 1100)
    }
    return () => {
      if(timerRef && timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [gameModeState])

  return (
    <div className='root'>
      <div></div>
      <MainMenuLoader />
      <div>
      </div>
      <CardsHand className={gameModeState !== GAME_MODES.MAIN_MENU ? 'cardsHide' : ''} keys={deck.map((x) => x.getId().toString())}>
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
