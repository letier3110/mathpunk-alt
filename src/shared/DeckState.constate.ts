import constate from 'constate'
import { useCallback, useState } from 'react'
import { CardType } from '../math/CardType'
import { GAME_MODES } from '../math/math'
import { NavigatorCard } from '../math/NavigatorCard'
import { getDeckPoolArithmetic } from '../pages/Arithmetic/Arithmetic.utils'
import { getDeckPoolDuel } from '../pages/Duel/Duel.utils'
import { getDeckPoolPlotting } from '../pages/Plotting/Plotting.utils'
import { INITIAL_DECK } from '../pages/Tutorial/Tutorial.const'
import { introDeck, mainMenuDeck } from './decks.data'

const initialState: Record<GAME_MODES, Array<CardType>> = {
  [GAME_MODES.ARITHMETICS]: getDeckPoolArithmetic(),
  [GAME_MODES.DUEL_FUNCTION]: getDeckPoolDuel(),
  [GAME_MODES.MAIN_MENU]: mainMenuDeck,
  [GAME_MODES.PLOTTING]: getDeckPoolPlotting({}),
  [GAME_MODES.INTRO]: introDeck,
  [GAME_MODES.TUTORIAL]: INITIAL_DECK
}

export const [DeckProvider, useDeck] = constate(() => {
  const [deckState, setDeckState] = useState<Record<GAME_MODES, Array<CardType>>>(initialState)

  const updateDeck = useCallback(
    (mode: GAME_MODES, state: Array<CardType>) => {
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

  return {
    deckState,
    updateDeck,
    getDeck,
    setDeckState
  }
})
