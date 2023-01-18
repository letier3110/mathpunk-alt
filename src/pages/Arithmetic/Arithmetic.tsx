import { CSSProperties, FC, useEffect, useMemo, useState } from 'react'
import { CardsChain } from '../../components/CardsChain/CardsChain'
import { CardsHand } from '../../components/CardsHand/CardsHand'
import { CardTypeView } from '../../components/CardTypeView/CardTypeView'
import { CardType } from '../../math/CardType'

import { DIFFICULTIES, GAME_MODES } from '../../math/math'
import { formatNumber } from '../../math/utils'
import { ARITHMETIC_VALUES, generateTargetArithmetic, getDeckPoolArithmetic } from './Arithmetic.utils'
import { useGameModeContext } from '../../hooks/GameState.constate'

import { NavigatorCard } from '../../math/NavigatorCard'
import { useGhostPreviewContext } from '../../hooks/GhostPreview.constate'
import { GhostPreview } from '../../components/GhostPreview/GhostPreview'
import { NavigatorTypeView } from '../../components/NavigatorTypeView/NavigatorTypeView'
import { useDeck } from '../../hooks/DeckState.constate'
import { arithmeticWinDeck, REROLL_POWER_NAME } from '../../shared/decks.data'
import { useInventoryContext } from '../Inventory/Inventory.constate'

interface AddCardProps {
  card: CardType
  index?: number
}

interface ArithmeticProps {
  //
}

const START_NEW_NAME = 'Start new game?'

export const Arithmetic: FC<ArithmeticProps> = () => {
  const { powers, mathOperators, addPower } = useInventoryContext()
  const { selectedCard, setSelectedCard } = useGhostPreviewContext()
  const { getDeck, updateDeck } = useDeck()
  const deck = getDeck(GAME_MODES.ARITHMETICS)
  const [hardMode, setHardMode] = useState<boolean>(false)
  const [count, setCount] = useState(generateTargetArithmetic())
  // const [left, setLeft] = useState(3)
  const [enemyHp, setEnemyHp] = useState(10)
  const [round, setRound] = useState<number>(1)
  const [chain, setChain] = useState<CardType[]>([])
  const [prediction, setPrediction] = useState(0)

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

  const isGameEnded = enemyHp <= 0
  const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY
  const preciseness = ARITHMETIC_VALUES[mode].preciseness

  const lessonEndDeck = useMemo(() => {
    const newArrs = arithmeticWinDeck.filter((x) => !powers.find((y) => y.getName() === x.getName()))
    return [new NavigatorCard(START_NEW_NAME)].concat(newArrs)
  }, [powers])

  useEffect(() => {
    if (equalizerResult === count) {
      setPrediction(-5)
    }
    const localPreciseness = preciseness / 100
    if (equalizerResult > count * (1 - localPreciseness) && equalizerResult < count * (1 + localPreciseness)) {
      const res = Math.round((1 - Math.abs((equalizerResult - count) / count)) * 5)
      setPrediction(-res)
    } else {
      setPrediction(5)
    }
  }, [equalizerResult, count, mode, preciseness, setPrediction])

  const handleAddCard = ({ card, index }: AddCardProps) => {
    if (index === undefined) {
      const newArr = chain.concat(card)
      setChain(newArr)
      updateDeck(
        GAME_MODES.ARITHMETICS,
        deck.filter((x) => x.getId() !== card.getId())
      )
    } else {
      const newArr = chain.slice(0, index).concat(card).concat(chain.slice(index))
      setChain(newArr)
      updateDeck(
        GAME_MODES.ARITHMETICS,
        deck.filter((x) => x.getId() !== card.getId())
      )
    }
  }

  const handleRemoveCard = ({ card, index }: AddCardProps) => {
    if (!index) {
      const newArr = deck.concat(card)
      updateDeck(GAME_MODES.ARITHMETICS, newArr)
      setChain(chain.filter((x) => x.getId() !== card.getId()))
    } else {
      const newArr = [...deck.slice(0, index), card, ...deck.slice(index)]
      updateDeck(GAME_MODES.ARITHMETICS, newArr)
      setChain(chain.filter((x) => x.getId() !== card.getId()))
    }
  }

  const handleStartNewRound = () => {
    setPrediction(0)
    setCount(generateTargetArithmetic(hardMode))
    setRound(round + 1)
    setChain([])
    // setLeft(3)
    updateDeck(GAME_MODES.ARITHMETICS, getDeckPoolArithmetic(mathOperators, hardMode))
  }

  const handleStartNewGame = () => {
    setPrediction(0)
    setCount(generateTargetArithmetic(hardMode))
    setRound(1)
    setChain([])
    updateDeck(GAME_MODES.ARITHMETICS, getDeckPoolArithmetic(mathOperators, hardMode))
    setEnemyHp(10)
    // setLeft(3)
  }

  const handleEqual = () => {
    setSelectedCard(null)
    setEnemyHp(enemyHp + prediction)
    handleStartNewRound()
  }

  const handleEndGameClick = (card: CardType) => {
    if (card.getName() === START_NEW_NAME) {
      handleStartNewGame()
      return
    }
    if (card.getName() === REROLL_POWER_NAME) {
      addPower(card)
      return
    }
  }

  return (
    <>
      <div className='root'>
        <div className='hps'>
          <div>
            Remaining points to beat:
            {enemyHp}
            {prediction !== 0 && chain.length > 0 && (
              <span style={{ color: prediction > 0 ? '#ff0000' : '#00aa00' }}>
                {' '}
                {prediction !== 0 ? `(${prediction > 0 ? '+' : ''}${prediction})` : ''}
              </span>
            )}
          </div>
        </div>
        {isGameEnded === false && (
          <>
            <div
              className={[chain.length === 0 && selectedCard ? 'border' : '', 'flex1'].join(' ')}
              style={{
                backgroundColor: chain.length === 0 && selectedCard ? 'rgba(0, 255, 0,.3)' : '',
                minHeight: '100px',
                minWidth: '100px'
              }}
              onMouseUp={() => {
                if (chain.length === 0 && selectedCard) {
                  handleAddCard({ card: selectedCard })
                  setSelectedCard(null)
                }
              }}
            >
              <div className='flex1 count'>{count}</div>
              <CardsChain
                chain={chain}
                keys={chain.map((x) => x.getId().toString())}
                equalizerResult={formatNumber(equalizerResult)}
                handleEqual={handleEqual}
              >
                {chain.map((x, i) => (
                  <CardTypeView
                    key={x.getId()}
                    card={x}
                    showPreview
                    className='card noAddition'
                    isHoverable={selectedCard !== null}
                    handleMouseUpBefore={() => {
                      if (selectedCard) {
                        handleAddCard({ card: selectedCard, index: i })
                        setSelectedCard(null)
                      }
                    }}
                    handleMouseUpAfter={() => {
                      if (selectedCard) {
                        handleAddCard({ card: selectedCard, index: i + 1 })
                        setSelectedCard(null)
                      }
                    }}
                    handleMouseDown={(card: CardType) => {
                      handleRemoveCard({ card })
                      setSelectedCard((prev) => (prev?.getId() === card.getId() ? null : card))
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
                      handleCardClick={() => handleAddCard({ card: x })}
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
              <div>You won!</div>
              <div>
                Hard mode?
                <input type='checkbox' checked={hardMode} onChange={(e) => setHardMode(e.target.checked)} />
              </div>
            </div>
            {selectedCard && (
              <GhostPreview
                isReward={selectedCard.getName() === REROLL_POWER_NAME}
                deck={lessonEndDeck}
                card={selectedCard}
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
                      isReward={x.getName() === REROLL_POWER_NAME}
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
