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
  const deck = [
    // new Navigator('Continue')
    new Navigator(TUTORIAL_NAME),
    new Navigator(ARITHMETIC_NAME),
    new Navigator(PLOTTING_NAME),
    new Navigator(DUEL_NAME)
  ]

  return (
    <div className='root'>
      <div></div>
      <div>
        <MainMenuLoader />
      </div>
      <CardsHand keys={deck.map((x) => x.getId().toString())}>
        {deck.map((x) => (
          <NavigatorTypeView
            key={x.getId()}
            card={x}
            handleCardClick={() => {
              // if (currentTurn === TurnsType.COMPETITOR) return
              // handleAddCard({ card: x })
              if (x.getName() === TUTORIAL_NAME) {
                setGameMode(GAME_MODES.TUTORIAL)
                return
              }
              if (x.getName() === ARITHMETIC_NAME) {
                setGameMode(GAME_MODES.ARITHMETICS)
                return
              }
              if (x.getName() === PLOTTING_NAME) {
                setGameMode(GAME_MODES.PLOTTING)
                return
              }
              if (x.getName() === DUEL_NAME) {
                setGameMode(GAME_MODES.DUEL_FUNCTION)
                return
              }
            }}
          />
        ))}
      </CardsHand>
    </div>
  )
}
