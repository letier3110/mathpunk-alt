import { CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react'
import { CardsChain } from '../../components/CardsChain/CardsChain'
import { CardsHand } from '../../components/CardsHand/CardsHand'
import { CardTypeView } from '../../components/CardTypeView/CardTypeView'
import { CardType } from '../../math/CardType'

import { DIFFICULTIES, GAME_MODES } from '../../math/math'
import { formatNumber } from '../../math/utils'
import { ARITHMETIC_VALUES, generateTargetArithmetic, getDeckPoolDuel, getEnemyDeckPoolArithmetic } from './Duel.utils'
import { useGameModeContext } from '../../hooks/GameState.constate'

import { NavigatorCard } from '../../math/NavigatorCard'
import { Reroll } from '../../components/Reroll/Reroll'
import { Numberator } from '../../math/Numberator'
import { Switcher } from '../../math/Switcher'
import { useGhostPreviewContext } from '../../hooks/GhostPreview.constate'
import { NavigatorTypeView } from '../../components/NavigatorTypeView/NavigatorTypeView'
import { GhostPreview } from '../../components/GhostPreview/GhostPreview'
import { useDeck } from '../../hooks/DeckState.constate'
import { useInventoryContext } from '../Inventory/Inventory.constate'

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

const lessonEndDeck = [new NavigatorCard(START_NEW_NAME)]

export const Duel: FC<DuelProps> = () => {
  const { mathOperators } = useInventoryContext()
  const { selectedCard, setSelectedCard } = useGhostPreviewContext()
  const { getDeck, updateDeck } = useDeck()
  const deck = getDeck(GAME_MODES.DUEL_FUNCTION)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [hardMode, setHardMode] = useState<boolean>(false)
  const [currentTurn, setCurrentTurn] = useState<TurnsType>(startingTurn)
  // const [left, setLeft] = useState(3)
  const [rounds, setRounds] = useState(initialRounds)
  const [chain, setChain] = useState<CardType[]>([initialChainCard])
  const [enemyDeck, setEnemyDeck] = useState<CardType[]>(getEnemyDeckPoolArithmetic())

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

  const handleAddCard = ({ card, index }: AddCardProps) => {
    if (index === undefined) {
      const newArr = chain.concat(card)
      setChain(newArr)
      updateDeck(
        GAME_MODES.DUEL_FUNCTION,
        deck.filter((x) => x.getId() !== card.getId())
      )
    } else {
      const newArr = [...chain.slice(0, index), card, ...chain.slice(index)]
      setChain(newArr)
      updateDeck(
        GAME_MODES.DUEL_FUNCTION,
        deck.filter((x) => x.getId() !== card.getId())
      )
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
      updateDeck(GAME_MODES.DUEL_FUNCTION, newArr)
      setChain(chain.filter((x) => x.getId() !== card.getId()))
    } else {
      const newArr = [...deck.slice(0, index), card, ...deck.slice(index)]
      updateDeck(GAME_MODES.DUEL_FUNCTION, newArr)
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
      updateDeck(GAME_MODES.DUEL_FUNCTION, getDeckPoolDuel(mathOperators, hardMode))
    } else {
      setEnemyDeck(getEnemyDeckPoolArithmetic(hardMode))
      setCurrentTurn(TurnsType.COMPETITOR)
      // if (left > 0) {
      //   setLeft(left - 1)
      // }
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
    updateDeck(GAME_MODES.DUEL_FUNCTION, getDeckPoolDuel(mathOperators, hardMode))
    setEnemyDeck(getEnemyDeckPoolArithmetic(hardMode))
    setRounds(initialRounds)
    // setLeft(3)
  }

  // const handleReroll = () => {
  //   if (left > 0) {
  //     // setLeft(left - 1)
  //     updateDeck(GAME_MODES.DUEL_FUNCTION, getDeckPoolDuel(hardMode))
  //   }
  // }

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
              className={[chain.length === 0 && selectedCard ? 'border' : '', 'flex1 duel'].join(' ')}
              style={{
                backgroundColor: chain.length === 0 && selectedCard ? 'rgba(0, 255, 0,.3)' : ''
              }}
              onMouseUp={() => {
                if (currentTurn === TurnsType.COMPETITOR) return
                if (chain.length === 0 && selectedCard) {
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
                {chain.map((x, i) => (
                  <CardTypeView
                    key={x.getId()}
                    card={x}
                    showPreview
                    className='card noAddition'
                    isHoverable={selectedCard !== null}
                    handleMouseDown={(card: CardType) => {
                      if (currentTurn === TurnsType.COMPETITOR) return
                      if (x instanceof Switcher) return
                      handleRemoveCard({ card })
                      setSelectedCard((prev) => (prev?.getId() === card.getId() ? null : card))
                    }}
                    handleMouseUpBefore={() => {
                      if (currentTurn === TurnsType.COMPETITOR) return
                      if (x instanceof Switcher) return
                      if (chain.length !== 0 && selectedCard) {
                        handleAddCard({ card: selectedCard, index: i })
                        setSelectedCard(null)
                      }
                    }}
                    handleMouseUpAfter={() => {
                      if (currentTurn === TurnsType.COMPETITOR) return
                      if (x instanceof Switcher) return
                      if (chain.length !== 0 && selectedCard) {
                        handleAddCard({ card: selectedCard, index: i + 1 })
                        setSelectedCard(null)
                      }
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
                {/* <Reroll left={left} handleReroll={handleReroll} /> */}
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
                    >
                      <div className='mainText'>{x.getName()}</div>
                    </NavigatorTypeView>
                  )
                })}
              </CardsHand>
            </div>
          </>
        )}
      </div>
    </>
  )
}
