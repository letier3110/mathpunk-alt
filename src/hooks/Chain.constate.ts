import constate from 'constate'
import { useState } from 'react'
import { CardType } from '../math/CardType'
import { FormulaeCardType } from '../math/formulae'
import { GAME_MODES } from '../math/math'
import { useDeck } from '../hooks/DeckState.constate'
import { useGameModeContext } from '../hooks/GameState.constate'

interface ChainProviderProps {
  gameMode: GAME_MODES
}

interface useChainContextProps<T = CardType> {
  chain: T[]
  deck: T[]
  setChain: React.Dispatch<React.SetStateAction<T[]>>
  setDeck: (deck: T[]) => void
}

export const [ChainProvider, useChainContext] = constate<ChainProviderProps, useChainContextProps, []>(
  ({ gameMode }) => {
    const [chain, setChain] = useState<CardType[]>([])
    const { getDeck, updateDeck } = useDeck()
    const deck = getDeck(gameMode)
    return {
      chain,
      deck,
      setChain,
      setDeck: (deck: CardType[]) => updateDeck(gameMode, deck)
    }
  }
)
