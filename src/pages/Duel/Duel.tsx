import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { CardsChain } from '../../components/CardsChain/CardsChain'
import { CardsHand } from '../../components/CardsHand/CardsHand'
import { CardTypeView } from '../../components/CardTypeView/CardTypeView'
import { CardType } from '../../math/arithmetic'

import { DIFFICULTIES, GAME_MODES } from '../../math/math'
import { formatNumber } from '../../math/utils'
import {
  ARITHMETIC_VALUES,
  generateTargetArithmetic,
  getDeckPoolArithmetic,
  getEnemyDeckPoolArithmetic
} from './Duel.utils'
import { useGameModeContext } from '../../shared/GameState.constate'

import { Reroll } from '../../components/Reroll/Reroll'
import { Numberator } from '../../math/Numberator'
import { Switcher } from '../../math/Switcher'

interface AddCardProps {
  card: CardType
  index?: number
}

interface DuelProps {
  //
}

const initialRounds = 5

enum TurnsType {
  PLAYER = 'player',
  COMPETITOR = 'competitor'
}

// const TURNS: Record<TurnsType, string> = {
//   [TurnsType.PLAYER]: 'player',
//   [TurnsType.COMPETITOR]: 'competitor'
// }

const startingTurn: TurnsType = TurnsType.PLAYER

export const Duel: FC<DuelProps> = () => {
  const { setGameMode } = useGameModeContext()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hardMode, setHardMode] = useState<boolean>(false)
  const [currentTurn, setCurrentTurn] = useState<TurnsType>(startingTurn)
  // const [count, setCount] = useState(generateTargetArithmetic())
  const [left, setLeft] = useState(3)
  const [rounds, setRounds] = useState(initialRounds)
  // const [round, setRound] = useState<number>(1)
  const [chain, setChain] = useState<CardType[]>([new Switcher(generateTargetArithmetic())])
  const [deck, setDeck] = useState<CardType[]>(getDeckPoolArithmetic())
  const [enemyDeck, setEnemyDeck] = useState<CardType[]>(getEnemyDeckPoolArithmetic())
  // const [prediction, setPrediction] = useState(0)

  const equalizerResult: number = useMemo(() => {
    if (chain.length === 0) return 0
    if (chain.length === 1) return Number(chain[0].getCount())
    const strResult = chain.reduce(
      (a, p, i) => a.concat(p.getCount().toString(), i === chain.length - 1 ? '' : p.getName()),
      ''
    )
    const result: number = eval(strResult)
    return result
  }, [chain])

  const isGameEnded = rounds <= 0
  // const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY
  // const preciseness = ARITHMETIC_VALUES[mode].preciseness

  // useEffect(() => {
  //   if (equalizerResult === count) {
  //     setPrediction(-5)
  //   }
  //   const localPreciseness = preciseness / 100
  //   if (equalizerResult > count * (1 - localPreciseness) && equalizerResult < count * (1 + localPreciseness)) {
  //     const res = Math.round((1 - Math.abs((equalizerResult - count) / count)) * 5)
  //     setPrediction(-res)
  //   } else {
  //     setPrediction(5)
  //   }
  // }, [equalizerResult, count, mode, preciseness, setPrediction])

  const handleAddCard = ({ card, index }: AddCardProps) => {
    if (!index) {
      const newArr = chain.concat(card)
      setChain(newArr)
      setDeck(deck.filter((x) => x.getId() !== card.getId()))
    } else {
      const newArr = [...chain.slice(0, index), card, ...chain.slice(index)]
      setChain(newArr)
      setDeck(deck.filter((x) => x.getId() !== card.getId()))
    }
  }

  const handleAddEnemyCard = ({ card, index }: AddCardProps) => {
    if (!index) {
      const newArr = chain.concat(card)
      setChain(newArr)
      setEnemyDeck(enemyDeck.filter((x) => x.getId() !== card.getId()))
    } else {
      const newArr = [...chain.slice(0, index), card, ...chain.slice(index)]
      setChain(newArr)
      setEnemyDeck(enemyDeck.filter((x) => x.getId() !== card.getId()))
    }
  }

  const handleRemoveCard = ({ card, index }: AddCardProps) => {
    if (!index) {
      const newArr = deck.concat(card)
      setDeck(newArr)
      setChain(chain.filter((x) => x.getId() !== card.getId()))
    } else {
      const newArr = [...deck.slice(0, index), card, ...deck.slice(index)]
      setDeck(newArr)
      setChain(chain.filter((x) => x.getId() !== card.getId()))
    }
  }

  const handleStartNewRound = () => {
    // setPrediction(0)
    // setCount(generateTargetArithmetic(hardMode))
    if (rounds === 1) {
      setRounds(0)
      return
    }
    if (currentTurn === TurnsType.COMPETITOR) {
      setCurrentTurn(TurnsType.PLAYER)
      setDeck(getDeckPoolArithmetic(hardMode))
    } else {
      setEnemyDeck(getEnemyDeckPoolArithmetic(hardMode))
      setCurrentTurn(TurnsType.COMPETITOR)
      if (left > 0) {
        setLeft(left - 1)
      }
    }
    setRounds(rounds - 1)
    setChain([new Switcher(equalizerResult)])
    // setLeft(3)
  }

  const handleStartNewGame = () => {
    // setPrediction(0)
    // setCount(generateTargetArithmetic(hardMode))
    setCurrentTurn(startingTurn)
    setRounds(initialRounds)
    setChain([new Switcher(generateTargetArithmetic(hardMode))])
    setDeck(getDeckPoolArithmetic(hardMode))
    setEnemyDeck(getEnemyDeckPoolArithmetic(hardMode))
    setRounds(initialRounds)
    setLeft(3)
  }

  const handleReroll = () => {
    if (left > 0) {
      setLeft(left - 1)
      setDeck(getDeckPoolArithmetic(hardMode))
    }
  }

  const handleEqual = () => {
    // setRounds(rounds + prediction)
    handleStartNewRound()
  }

  useEffect(() => {
    if(currentTurn === TurnsType.COMPETITOR) {
      timerRef.current = setTimeout(() => {
        if(enemyDeck.length > 0) {
          const randomFromDeck = Math.floor(Math.random() * enemyDeck.length)
          handleAddEnemyCard({card:enemyDeck[randomFromDeck]})
        }
      }, 500)
    }
    return () => {
      if(timerRef && timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [currentTurn, enemyDeck])

  // const

  return (
    <>
      <div className='header'>
        <div>
          Remaining rounds:
          {rounds}
        </div>
      </div>
      <div className='root'>
        {isGameEnded === false && (
          <>
            <CardsHand className={'enemyDeck'} keys={enemyDeck.map((x) => x.getId().toString())}>
              {enemyDeck.map((x) => (
                <CardTypeView key={x.getId()} card={x} />
              ))}
            </CardsHand>
            <CardsChain
              chain={chain}
              className={currentTurn === TurnsType.COMPETITOR ? 'enemyChain' : ''}
              keys={chain.map((x) => x.getId().toString())}
              equalizerResult={formatNumber(equalizerResult)}
              handleEqual={() => {
                if (currentTurn === TurnsType.COMPETITOR && enemyDeck.length === 0) {
                  handleEqual();
                  return
                }
                handleEqual();
              }}
            >
              {chain.map((x) => (
                <CardTypeView
                  key={x.getId()}
                  card={x}
                  showPreview
                  className='card noAddition'
                  handleCardClick={() => {
                    if (currentTurn === TurnsType.COMPETITOR) return
                    if (x instanceof Switcher) return
                    handleRemoveCard({ card: x })
                  }}
                />
              ))}
            </CardsChain>
            <CardsHand keys={deck.map((x) => x.getId().toString())}>
              {deck.map((x) => (
                <CardTypeView
                  key={x.getId()}
                  card={x}
                  handleCardClick={() => {
                    if (currentTurn === TurnsType.COMPETITOR) return
                    handleAddCard({ card: x })
                  }}
                />
              ))}
            </CardsHand>
          </>
        )}
        {isGameEnded === true && (
          <div className='win'>
            <div>🥳🥳🥳</div>
            <div>{equalizerResult > 0 ? `You won!` : `Your enemy won!`}</div>
            <div>
              Hard mode?
              <input type='checkbox' checked={hardMode} onChange={(e) => setHardMode(e.target.checked)} />
            </div>
            <div className='card' onClick={handleStartNewGame}>
              Start new game?
            </div>
          </div>
        )}
      </div>
      <Reroll left={left} handleReroll={handleReroll} />
    </>
  )
}
