import { FC, useEffect, useRef, useState } from 'react'
import { CardsHand } from '../../components/CardsHand/CardsHand'
import { CardType } from '../../math/arithmetic'

import { GAME_MODES } from '../../math/math'
import { useGameModeContext } from '../../shared/GameState.constate'

import { Navigator } from '../../math/Navigator'
import { NavigatorTypeView } from '../../components/NavigatorTypeView/NavigatorTypeView'

interface AddCardProps {
  card: CardType
  index?: number
}

interface DuelProps {
  //
}

const TUTORIAL_NAME = 'Start Tutorial?'
const ARITHMETIC_NAME = 'Start Arithmetic?'
const PLOTTING_NAME = 'Start Plotting?'
const DUEL_NAME = 'Start Duel?'

const INITIAL_PROGRESS = 15
const PROGRESS_DELTA = 5
const FINAL_PROGRESS = 175

export const MainMenu: FC<DuelProps> = () => {
  const { setGameMode } = useGameModeContext()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const deck = [
    // new Navigator('Continue')
    new Navigator(TUTORIAL_NAME),
    new Navigator(ARITHMETIC_NAME),
    new Navigator(PLOTTING_NAME),
    new Navigator(DUEL_NAME)
  ]
  const secondaryColor = '#fa5'
  const strokeWidth = 4

  const circleStyle = {}

  const [progress, setProgress] = useState(INITIAL_PROGRESS)

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setProgress((p) => (p > FINAL_PROGRESS ? INITIAL_PROGRESS : p + PROGRESS_DELTA))
    }, 100)
    return () => {
      if (timerRef && timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [progress])

  return (
    <div className='root'>
      <div></div>
      <div>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox={`0 0 300 300`}
          stroke='#5af'
          width={300}
          height={300}
          strokeWidth={1}
        >
          <circle cx='100' cy='100' fill='none' r='28' stroke={secondaryColor} strokeWidth={strokeWidth} />
          <circle
            cx='100'
            cy='100'
            fill='none'
            r='28'
            stroke='currentColor'
            strokeDasharray={`${progress}, 170`}
            strokeDashoffset='1'
            strokeLinecap='round'
            strokeWidth={strokeWidth}
            style={circleStyle}
            transform='rotate(-90 100 100)'
          />
        </svg>
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
