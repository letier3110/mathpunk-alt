import constate from 'constate'
import { useState } from 'react'
import { CardType } from '../math/CardType'
import { FormulaeCardType } from '../math/formulae'
import { GAME_MODES } from '../math/math'
import { useDeck } from '../hooks/DeckState.constate'
import { useGameModeContext } from '../hooks/GameState.constate'
import { VectorCard } from '../math/VectorCard'

interface ChainProviderProps {
  gameMode: GAME_MODES
}

interface useChainContextProps<T = CardType | VectorCard> {
  chain: T[]
  deck: T[]
  setChain: React.Dispatch<React.SetStateAction<T[]>>
  setDeck: (deck: T[]) => void
}

type returnType<T = CardType | VectorCard> = [
  React.FC<React.PropsWithChildren<ChainProviderProps>>,
  () => useChainContextProps<T>
]

export const [ChainProvider, useChainContext]: returnType = constate<ChainProviderProps, useChainContextProps, []>(
  ({ gameMode }) => {
    const [chain, setChain] = useState<Array<CardType | VectorCard>>([])
    const { getDeck, updateDeck } = useDeck()
    const deck = getDeck(gameMode)
    return {
      chain,
      deck,
      setChain,
      setDeck: (deck: Array<CardType | VectorCard>) => updateDeck(gameMode, deck)
    }
  }
)

// export const getProviderAndContext = <T = CardType>() => {
//   return constate<ChainProviderProps, useChainContextProps<T>, []>(
//     ({ gameMode }) => {
//       const [chain, setChain] = useState<T[]>([])
//       const { getDeck, updateDeck } = useDeck()
//       const deck = getDeck(gameMode)
//       return {
//         chain,
//         deck,
//         setChain,
//         setDeck: (deck: T[]) => updateDeck(gameMode, deck)
//       }
//     }
//   )
// }
