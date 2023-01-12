import constate from 'constate'
import { useState } from 'react'
import { CardType } from '../../math/CardType'
import { FormulaeCardType } from '../../math/formulae'
import { GAME_MODES } from '../../math/math'
import { useDeck } from '../../hooks/DeckState.constate'
import { useGameModeContext } from '../../hooks/GameState.constate'

export const [PlottingProvider, usePlottingContext] = constate(() => {
  const [chain, setChain] = useState<FormulaeCardType[]>([])
  const { getDeck, updateDeck } = useDeck()
  const deck = getDeck(GAME_MODES.PLOTTING)
  return {
    chain,
    deck,
    setChain,
    setDeck: (deck: CardType[]) => updateDeck(GAME_MODES.PLOTTING, deck)
  }
})
