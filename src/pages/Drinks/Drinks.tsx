import { CSSProperties, FC, useEffect, useMemo, useState } from 'react'
import { CardsChain } from '../../components/CardsChain/CardsChain'
import { CardsHand } from '../../components/CardsHand/CardsHand'
import { CardTypeView } from '../../components/CardTypeView/CardTypeView'
import { CardType } from '../../math/CardType'

import { DIFFICULTIES, GAME_MODES } from '../../math/math'
import { formatNumber } from '../../math/utils'
import { ARITHMETIC_VALUES, generateTargetDrinks, getDeckPoolDrinks } from './Drinks.utils'

import { NavigatorCard } from '../../math/NavigatorCard'
import { useGhostPreviewContext } from '../../hooks/GhostPreview.constate'
import { GhostPreview } from '../../components/GhostPreview/GhostPreview'
import { NavigatorTypeView } from '../../components/NavigatorTypeView/NavigatorTypeView'
import { useDeck } from '../../hooks/DeckState.constate'
import { useInventoryContext } from '../Inventory/Inventory.constate'
import { compareColors, IColor, isColorEqual } from '../../math/ColorType'
import { ColorSquare } from '../../components/ColorSquare/ColorSquare'
import { VectorCard } from '../../math/VectorCard'
import { ColorCardTypeView } from '../../components/ColorCardTypeView/ColorCardTypeView'

interface AddCardProps {
  card: CardType | VectorCard
  index?: number
}

interface DrinksProps {
  //
}

const START_NEW_NAME = 'Start new game?'

export const Drinks: FC<DrinksProps> = () => {
  const { powers, mathOperators, addPower } = useInventoryContext()
  const { selectedCard, setSelectedCard } = useGhostPreviewContext()
  const { getDeck, updateDeck } = useDeck()
  const deck = getDeck(GAME_MODES.DRINKS)
  const [hardMode, setHardMode] = useState<boolean>(false)
  const [count, setCount] = useState(generateTargetDrinks())
  const [enemyHp, setEnemyHp] = useState(30)

  const [chain, setChain] = useState<Array<CardType | VectorCard>>([])
  const [prediction, setPrediction] = useState(0)

  const equalizerResult: IColor = useMemo(() => {
    // if (chain.length === 0) return 0
    // if (chain.length === 1) return Number(chain[0].getCount())
    // const strResult = chain.reduce(
    //   (a, p, i) => a.concat(p.getCount().toString(), i === chain.length - 1 ? '' : p.getName()),
    //   ''
    // )
    // const result: number = eval(strResult)
    // return result
    return {
      red: 0,
      green: 0,
      blue: 0
    }
  }, [chain])

  const isGameEnded = enemyHp <= 0
  const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY
  const preciseness = ARITHMETIC_VALUES[mode].preciseness

  const lessonEndDeck = useMemo(() => {
    // const newArrs = arithmeticWinDeck.filter((x) => !powers.find((y) => y.getName() === x.getName()))
    return [new NavigatorCard(START_NEW_NAME)] //.concat()
  }, [powers])

  useEffect(() => {
    if (isColorEqual(equalizerResult, count)) {
      setPrediction(-5)
    }
    // const localPreciseness = preciseness / 100
    setPrediction(-compareColors(equalizerResult, count))
  }, [equalizerResult, count, mode, preciseness, setPrediction])

  const handleAddCard = ({ card, index }: AddCardProps) => {
    if (index === undefined) {
      const newArr = chain.concat(card)
      setChain(newArr)
      updateDeck(
        GAME_MODES.DRINKS,
        deck.filter((x) => x.getId() !== card.getId())
      )
    } else {
      const newArr = chain.slice(0, index).concat(card).concat(chain.slice(index))
      setChain(newArr)
      updateDeck(
        GAME_MODES.DRINKS,
        deck.filter((x) => x.getId() !== card.getId())
      )
    }
  }

  const handleRemoveCard = ({ card, index }: AddCardProps) => {
    if (!index) {
      const newArr = deck.concat(card)
      updateDeck(GAME_MODES.DRINKS, newArr)
      setChain(chain.filter((x) => x.getId() !== card.getId()))
    } else {
      const newArr = [...deck.slice(0, index), card, ...deck.slice(index)]
      updateDeck(GAME_MODES.DRINKS, newArr)
      setChain(chain.filter((x) => x.getId() !== card.getId()))
    }
  }

  const handleStartNewRound = () => {
    setPrediction(0)
    setCount(generateTargetDrinks(hardMode))
    setChain([])
    // setLeft(3)
    updateDeck(GAME_MODES.DRINKS, getDeckPoolDrinks(mathOperators, hardMode))
  }

  const handleStartNewGame = () => {
    setPrediction(0)
    setCount(generateTargetDrinks(hardMode))
    setChain([])
    updateDeck(GAME_MODES.DRINKS, getDeckPoolDrinks(mathOperators, hardMode))
    setEnemyHp(30)
    // setLeft(3)
  }

  const handleEqual = () => {
    setSelectedCard(null)
    setEnemyHp(enemyHp + prediction)
    handleStartNewRound()
  }

  const handleEndGameClick = (card: CardType | VectorCard) => {
    if (card.getName() === START_NEW_NAME) {
      handleStartNewGame()
      return
    }
  }

  return (
    <>
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
            <div className='flex1 count'>
              <ColorSquare color={count} />
            </div>
            <CardsChain
              chain={chain}
              keys={chain.map((x) => x.getId().toString())}
              equalizerResult={<ColorSquare color={equalizerResult} />}
              handleEqual={handleEqual}
            >
              {chain.map((x, i) => {
                if (x instanceof VectorCard) {
                  return (
                    <ColorCardTypeView
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
                      handleMouseDown={(card: VectorCard) => {
                        handleRemoveCard({ card })
                        setSelectedCard((prev) => (prev?.getId() === card.getId() ? null : card))
                      }}
                    />
                  )
                }
                return (
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
                )
              })}
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
                if (x instanceof VectorCard) {
                  return (
                    <ColorCardTypeView
                      key={x.getId()}
                      card={x}
                      style={style}
                      handleCardClick={() => handleAddCard({ card: x })}
                      handleMouseDown={(card: VectorCard) =>
                        setSelectedCard((prev) => (prev?.getId() === card.getId() ? null : card))
                      }
                    />
                  )
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
    </>
  )
}
