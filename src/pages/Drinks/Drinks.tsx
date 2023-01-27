import { CSSProperties, FC, useEffect, useMemo, useState } from 'react'
import { CardsChain } from '../../components/CardsChain/CardsChain'
import { CardsHand } from '../../components/CardsHand/CardsHand'
import { CardTypeView } from '../../components/CardTypeView/CardTypeView'
import { CardType } from '../../math/CardType'

import { DIFFICULTIES, GAME_MODES } from '../../math/math'
import { ARITHMETIC_VALUES, generateTargetDrinks, getDeckPoolDrinks } from './Drinks.utils'

import { NavigatorCard } from '../../math/NavigatorCard'
import { useGhostPreviewContext } from '../../hooks/GhostPreview.constate'
import { GhostPreview } from '../../components/GhostPreview/GhostPreview'
import { NavigatorTypeView } from '../../components/NavigatorTypeView/NavigatorTypeView'
import { useDeck } from '../../hooks/DeckState.constate'
import { useInventoryContext } from '../Inventory/Inventory.constate'
import { compareColors, IColor, isColorEqual, summColors } from '../../math/ColorType'
import { ColorSquare, vectorCardToColor } from '../../components/ColorSquare/ColorSquare'
import { VectorCard } from '../../math/VectorCard'
import { ColorCardTypeView } from '../../components/ColorCardTypeView/ColorCardTypeView'
import { OperatorCard } from '../../math/OperatorCard'

interface AddCardProps {
  card: OperatorCard
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

  const [chain, setChain] = useState<Array<OperatorCard>>([])
  const [prediction, setPrediction] = useState(0)

  const equalizerResult: IColor = useMemo(() => {
    const baseColor = {
      red: 0,
      green: 0,
      blue: 0
    }
    if (chain.length === 0) return baseColor
    if (chain.length === 1) return vectorCardToColor(chain[0].getCard() as VectorCard)
    const strResult = chain.reduce<IColor>(
      // (a, p, i) => a.concat(p.getCount().toString(), i === chain.length - 1 ? '' : p.getName()),
      (a, p, i) => summColors(a, vectorCardToColor(p.getCard() as VectorCard)),
      baseColor
    )
    // const result: number = eval(strResult)
    // return result
    return strResult
    // return {
    //   red: 0,
    //   green: 0,
    //   blue: 0
    // }
  }, [chain])

  const isGameEnded = enemyHp <= 0
  const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY
  const preciseness = ARITHMETIC_VALUES[mode].preciseness

  const lessonEndDeck = useMemo(() => {
    // const newArrs = arithmeticWinDeck.filter((x) => !powers.find((y) => y.getName() === x.getName()))
    return [new NavigatorCard({ name: START_NEW_NAME, card: new CardType({ name: '' }) })] //.concat()
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
        deck.filter((x) => !OperatorCard.isCardsEqual(x, card))
      )
    } else {
      const newArr = chain.slice(0, index).concat(card).concat(chain.slice(index))
      setChain(newArr)
      updateDeck(
        GAME_MODES.DRINKS,
        deck.filter((x) => !OperatorCard.isCardsEqual(x, card))
      )
    }
  }

  const handleRemoveCard = ({ card, index }: AddCardProps) => {
    if (!index) {
      const newArr = deck.concat(card)
      updateDeck(GAME_MODES.DRINKS, newArr)
      setChain(chain.filter((x) => !OperatorCard.isCardsEqual(x, card)))
    } else {
      const newArr = [...deck.slice(0, index), card, ...deck.slice(index)]
      updateDeck(GAME_MODES.DRINKS, newArr)
      setChain(chain.filter((x) => !OperatorCard.isCardsEqual(x, card)))
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

  const handleEndGameClick = (card: OperatorCard) => {
    if (card.getCard().getName() === START_NEW_NAME) {
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
              keys={chain.map((x) => x.getCard().getId().toString())}
              equalizerResult={<ColorSquare color={equalizerResult} />}
              handleEqual={handleEqual}
            >
              {chain.map((x, i) => {
                if (x.getCard() instanceof VectorCard) {
                  return (
                    <ColorCardTypeView
                      key={x.getCard().getId()}
                      operator={x}
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
                      handleMouseDown={() => {
                        handleRemoveCard({ card: x })
                        setSelectedCard((prev) => (prev?.getCard().getId() === x.getCard().getId() ? null : x))
                      }}
                    />
                  )
                }
                return (
                  <CardTypeView
                    key={x.getCard().getId()}
                    card={x.getCard() as CardType}
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
                    handleMouseDown={() => {
                      setSelectedCard((prev) => (prev?.getCard().getId() === x.getCard().getId() ? null : x))
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
            <CardsHand keys={deck.map((x) => x.getCard().getId().toString())}>
              {deck.map((x) => {
                const isSelected = x.getCard().getId() === selectedCard?.getCard().getId()
                const style: CSSProperties = {
                  scale: isSelected ? '1.2' : '1',
                  zIndex: isSelected ? 200 : '',
                  visibility: !isSelected ? 'visible' : 'hidden'
                }
                if (x.getCard() instanceof VectorCard) {
                  return (
                    <ColorCardTypeView
                      key={x.getCard().getId()}
                      operator={x}
                      style={style}
                      handleCardClick={() => handleAddCard({ card: x })}
                      handleMouseDown={() =>
                        setSelectedCard((prev) => (prev?.getCard().getId() === x.getCard().getId() ? null : x))
                      }
                    />
                  )
                }
                return (
                  <CardTypeView
                    key={x.getCard().getId()}
                    card={x.getCard() as CardType}
                    style={style}
                    handleCardClick={() => handleAddCard({ card: x })}
                    handleMouseDown={() =>
                      setSelectedCard((prev) => (prev?.getCard().getId() === x.getCard().getId() ? null : x))
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
            <CardsHand keys={lessonEndDeck.map((x) => x.getCard().getId().toString())}>
              {lessonEndDeck.map((x) => {
                const isSelected = x.getCard().getId() === selectedCard?.getCard().getId()
                const style: CSSProperties = {
                  scale: isSelected ? '1.2' : '1',
                  zIndex: isSelected ? 200 : '',
                  visibility: !isSelected ? 'visible' : 'hidden'
                }
                return (
                  <NavigatorTypeView
                    key={x.getCard().getId()}
                    card={x.getCard() as CardType}
                    handleCardClick={() => {
                      handleEndGameClick(x)
                    }}
                    style={style}
                    handleMouseDown={() =>
                      setSelectedCard((prev) => (prev?.getCard().getId() === x.getCard().getId() ? null : x))
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
