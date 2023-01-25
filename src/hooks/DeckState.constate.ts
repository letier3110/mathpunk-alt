import constate from 'constate'
import { useCallback, useEffect, useState } from 'react'
import { ArithmeticCardTypeEnum } from '../math/arithmetic'
import { CardType } from '../math/CardType'
import { GAME_MODES } from '../math/math'
import { VectorCard } from '../math/VectorCard'
import { getDeckPoolArithmetic } from '../pages/Arithmetic/Arithmetic.utils'
import { getDeckPoolDrinks } from '../pages/Drinks/Drinks.utils'
import { getDeckPoolDuel } from '../pages/Duel/Duel.utils'
import { useInventoryContext } from '../pages/Inventory/Inventory.constate'
import { getDeckPoolPlotting } from '../pages/Plotting/Plotting.utils'
import { INITIAL_DECK } from '../pages/Tutorial/Tutorial.const'
import { introDeck, mainMenuDeck } from '../shared/decks.data'

type TDeckState = Record<GAME_MODES, Array<CardType | VectorCard>>

const getInitialState = (operators: Array<ArithmeticCardTypeEnum>): TDeckState => {
  return {
    [GAME_MODES.ARITHMETICS]: getDeckPoolArithmetic(operators),
    [GAME_MODES.DUEL_FUNCTION]: getDeckPoolDuel(operators),
    [GAME_MODES.MAIN_MENU]: mainMenuDeck,
    [GAME_MODES.PLOTTING]: getDeckPoolPlotting({ operators: operators }),
    [GAME_MODES.INTRO]: introDeck,
    [GAME_MODES.TUTORIAL]: INITIAL_DECK,
    [GAME_MODES.DRINKS]: getDeckPoolDrinks(operators),
    // [GAME_MODES.EQUATIONS]: [],
  }
}

export const [DeckProvider, useDeck] = constate(() => {
  const { mathOperators } = useInventoryContext()
  const [deckState, setDeckState] = useState<TDeckState>(getInitialState([]))

  const updateDeck = useCallback(
    (mode: GAME_MODES, state: Array<CardType | VectorCard>) => {
      setDeckState((prev) => ({
        ...prev,
        [mode]: state
      }))
    },
    [deckState]
  )

  const getDeck = useCallback(
    (mode: GAME_MODES) => {
      return deckState[mode]
    },
    [deckState]
  )

  const refreshDeck = useCallback(
    (mode: GAME_MODES) => {
      if (mode === GAME_MODES.INTRO) return
      if (mode === GAME_MODES.MAIN_MENU) return
      if (mode === GAME_MODES.TUTORIAL) return
      if (mode === GAME_MODES.PLOTTING) {
        setDeckState((prev) => ({
          ...prev,
          [mode]: getDeckPoolPlotting({ operators: mathOperators })
        }))
        return
      }
      if (mode === GAME_MODES.ARITHMETICS) {
        setDeckState((prev) => ({
          ...prev,
          [mode]: getDeckPoolArithmetic(mathOperators)
        }))
        return
      }
      if (mode === GAME_MODES.DUEL_FUNCTION) {
        setDeckState((prev) => ({
          ...prev,
          [mode]: getDeckPoolDuel(mathOperators)
        }))
        return
      }
    },
    [deckState]
  )

  useEffect(() => {
    const newDeck = getInitialState(mathOperators)
    setDeckState((prev) => ({
      ...prev,
      ...newDeck,
      [GAME_MODES.MAIN_MENU]: prev[GAME_MODES.MAIN_MENU],
      [GAME_MODES.INTRO]: prev[GAME_MODES.INTRO],
      [GAME_MODES.TUTORIAL]: prev[GAME_MODES.TUTORIAL]
    }))
  }, [mathOperators])

  return {
    deckState,
    updateDeck,
    getDeck,
    refreshDeck,
    setDeckState
  }
})
