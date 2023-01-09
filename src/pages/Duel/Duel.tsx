import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react'
import { CardsChain } from '../../components/CardsChain/CardsChain'
import { CardsHand } from '../../components/CardsHand/CardsHand'
import { CardTypeView } from '../../components/CardTypeView/CardTypeView'
import { CardType } from '../../math/CardType'

import { DIFFICULTIES, GAME_MODES } from '../../math/math'
import { formatNumber } from '../../math/utils'
import {
  ARITHMETIC_VALUES,
  generateTargetArithmetic,
  getDeckPoolArithmetic,
  getEnemyDeckPoolArithmetic
} from './Duel.utils'
import { useGameModeContext } from '../../shared/GameState.constate'

import { Navigator } from '../../math/Navigator'
import { Reroll } from '../../components/Reroll/Reroll'
import { Numberator } from '../../math/Numberator'
import { Switcher } from '../../math/Switcher'
import { useGhostPreviewContext } from '../../shared/GhostPreview.constate'
import { NavigatorTypeView } from '../../components/NavigatorTypeView/NavigatorTypeView'
import { GhostPreview } from '../../components/GhostPreview/GhostPreview'

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

const startingTurn: TurnsType = TurnsType.PLAYER

const initialChainCard = new Switcher()
initialChainCard.setCount(generateTargetArithmetic())

const START_NEW_NAME = 'Start new game?'

const lessonEndDeck = [new Navigator(START_NEW_NAME)]

export const Duel: FC<DuelProps> = () => {
  const { setGameMode } = useGameModeContext()
  const { selectedCard, setSelectedCard } = useGhostPreviewContext()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [hardMode, setHardMode] = useState<boolean>(false)
  const [currentTurn, setCurrentTurn] = useState<TurnsType>(startingTurn)
  // const [count, setCount] = useState(generateTargetArithmetic())
  const [left, setLeft] = useState(3)
  const [rounds, setRounds] = useState(initialRounds)
  // const [round, setRound] = useState<number>(1)
  const [chain, setChain] = useState<CardType[]>([initialChainCard])
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
    const sw = new Switcher()
    sw.setCount(equalizerResult)
    setChain([sw])
    // setLeft(3)
  }

  const handleStartNewGame = () => {
    // setPrediction(0)
    // setCount(generateTargetArithmetic(hardMode))
    setCurrentTurn(startingTurn)
    setRounds(initialRounds)
    const sw = new Switcher()
    sw.setCount(generateTargetArithmetic(hardMode))
    setChain([sw])
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
    setSelectedCard(null)
    // setRounds(rounds + prediction)
    handleStartNewRound()
  }

  const handleEndGameClick = (card: CardType) => {
    if (card.getName() === START_NEW_NAME) {
      handleStartNewGame()
      return
    }
  }

  useEffect(() => {
    if (currentTurn === TurnsType.COMPETITOR) {
      timerRef.current = setTimeout(() => {
        if (enemyDeck.length > 0) {
          const randomFromDeck = Math.floor(Math.random() * enemyDeck.length)
          handleAddEnemyCard({ card: enemyDeck[randomFromDeck] })
        }
      }, 500)
    }
    return () => {
      if (timerRef && timerRef.current) {
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
            <div
              className={[selectedCard ? 'border' : '', 'flex1 duel'].join(' ')}
              style={{
                backgroundColor: selectedCard ? 'rgba(0, 255, 0,.3)' : ''
              }}
              onMouseUp={() => {
                if (selectedCard) {
                  handleAddCard({ card: selectedCard })
                  setSelectedCard(null)
                }
              }}
            >
              <CardsChain
                chain={chain}
                className={currentTurn === TurnsType.COMPETITOR ? 'enemyChain' : ''}
                keys={chain.map((x) => x.getId().toString())}
                equalizerResult={formatNumber(equalizerResult)}
                handleEqual={() => {
                  if (currentTurn === TurnsType.COMPETITOR && enemyDeck.length === 0) {
                    handleEqual()
                    return
                  }
                  handleEqual()
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
            </div>
            {selectedCard && (
              <GhostPreview
                deck={deck}
                card={selectedCard}
                showField={'count'}
                handleMouseUp={() => {
                  if (selectedCard) {
                    setSelectedCard(null)
                  }
                }}
              />
            )}
            <div
              className={[selectedCard ? 'border' : ''].join(' ')}
              style={{
                backgroundColor: selectedCard ? 'rgba(0, 255, 0,.3)' : ''
              }}
              onMouseUp={() => {
                if (selectedCard) {
                  setSelectedCard(null)
                }
              }}
            >
              <CardsHand keys={deck.map((x) => x.getId().toString())}>
                {deck.map((x) => {
                  const isSelected = x.getId() === selectedCard?.getId()
                  const style: CSSProperties = {
                    scale: isSelected ? '1.2' : '1',
                    zIndex: isSelected ? 200 : '',
                    visibility: !isSelected ? 'visible' : 'hidden'
                  }
                  return (
                    <CardTypeView
                      key={x.getId()}
                      card={x}
                      style={style}
                      handleCardClick={() => {
                        if (currentTurn === TurnsType.COMPETITOR) return
                        handleAddCard({ card: x })
                      }}
                      handleMouseDown={(card: CardType) => {
                        if (currentTurn === TurnsType.COMPETITOR) return
                        setSelectedCard((prev) => (prev?.getId() === card.getId() ? null : card))
                      }}
                    />
                  )
                })}
              </CardsHand>
            </div>
          </>
        )}
        {isGameEnded === true && (
          <>
            <div
              className={[selectedCard ? 'border' : '', 'win'].join(' ')}
              style={{
                backgroundColor: selectedCard ? 'rgba(0, 255, 0,.3)' : ''
              }}
              onMouseUp={() => {
                if (selectedCard) {
                  handleEndGameClick(selectedCard)
                  setSelectedCard(null)
                }
              }}
            >
              <div>🥳🥳🥳</div>
              <div>{equalizerResult > 0 ? `You won!` : `Your enemy won!`}</div>
              <div>
                Hard mode?
                <input type='checkbox' checked={hardMode} onChange={(e) => setHardMode(e.target.checked)} />
              </div>
            </div>
            {selectedCard && <GhostPreview deck={lessonEndDeck} card={selectedCard} />}
            <div
              className={[selectedCard ? 'border' : ''].join(' ')}
              style={{
                backgroundColor: selectedCard ? 'rgba(0, 255, 0,.3)' : ''
              }}
              onMouseUp={() => {
                if (selectedCard) {
                  setSelectedCard(null)
                }
              }}
            >
              <CardsHand keys={lessonEndDeck.map((x) => x.getId().toString())}>
                {lessonEndDeck.map((x) => {
                  const isSelected = x.getId() === selectedCard?.getId()
                  const style: CSSProperties = {
                    scale: isSelected ? '1.2' : '1',
                    zIndex: isSelected ? 200 : '',
                    visibility: !isSelected ? 'visible' : 'hidden'
                  }
                  return (
                    <NavigatorTypeView
                      key={x.getId()}
                      card={x}
                      handleCardClick={() => {
                        handleEndGameClick(x)
                      }}
                      style={style}
                      handleMouseDown={(card: CardType) =>
                        setSelectedCard((prev) => (prev?.getId() === card.getId() ? null : card))
                      }
                    />
                  )
                })}
              </CardsHand>
            </div>
          </>
        )}
      </div>
      <Reroll left={left} handleReroll={handleReroll} />
    </>
  )
}
