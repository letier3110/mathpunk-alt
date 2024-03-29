import { CSSProperties, FC, Fragment, useMemo, useState } from 'react'
import { AdditionView } from '../../components/AdditionView/AdditionView'
import { CardsHand } from '../../components/CardsHand/CardsHand'
import { CardTypeView } from '../../components/CardTypeView/CardTypeView'
import { ArithmeticCardTypeEnum, ArithmeticCardTypes } from '../../math/arithmetic'
import { CardType } from '../../math/CardType'
import { ArithmeticCardTypeEnumToClass, GAME_MODES } from '../../math/math'
import { Numberator } from '../../math/Numberator'
import { formatNumber } from '../../math/utils'
import { useGameModeContext } from '../../hooks/GameState.constate'
import { useGhostPreviewContext } from '../../hooks/GhostPreview.constate'
import { useInventoryContext } from '../Inventory/Inventory.constate'
import { INITIAL_CHAIN, INITIAL_DECK, INITIAL_ENEMY_HP, targetEnemyHp, tutorialSeries } from './Tutorial.const'
import { GhostPreview } from '../../components/GhostPreview/GhostPreview'
import { NavigatorTypeView } from '../../components/NavigatorTypeView/NavigatorTypeView'
import {
  CONTINUE_LESSON_NAME,
  CONTINUE_NAME,
  gameOverDeck,
  lessonEndDeck,
  RESTART_TUTORIAL_NAME,
  SKIP_NAME,
  START_AGAIN_NAME
} from '../../shared/decks.data'
import { useDeck } from '../../hooks/DeckState.constate'
import { Cube } from '../../components/Cube/Cube'

interface AddCardProps {
  card: CardType
  index?: number
}

interface TutorialProps {
  //
}

export const Tutorial: FC<TutorialProps> = () => {
  const { gameMode, setGameMode } = useGameModeContext()
  const { addMathOperator } = useInventoryContext()
  const { getDeck, updateDeck } = useDeck()
  const deck = getDeck(GAME_MODES.TUTORIAL)
  const { selectedCard, setSelectedCard } = useGhostPreviewContext()
  const [tutorialStep, setTutorialStep] = useState<ArithmeticCardTypeEnum>(tutorialSeries[0].name)
  const [tutorialInnerStep, setTutorialInnerStep] = useState(0)
  const [chain, setChain] = useState<CardType[]>(INITIAL_CHAIN)
  const [error, setError] = useState<string | null>(null)
  const [enemyHp, setEnemyHp] = useState(INITIAL_ENEMY_HP)
  const [tutorialEnded, setTutorialEnded] = useState(false)

  const currentTutorialIndex = useMemo(() => tutorialSeries.findIndex((x) => x.name === tutorialStep), [tutorialStep])

  const initiaChain: CardType[] = useMemo(
    () => tutorialSeries[currentTutorialIndex].tutorials[tutorialInnerStep].chain,
    [currentTutorialIndex, tutorialInnerStep]
  )
  const initialDeckStepPlus: CardType[] = useMemo(
    () => tutorialSeries[currentTutorialIndex].tutorials[tutorialInnerStep].cards,
    [currentTutorialIndex, tutorialInnerStep]
  )
  const targetCount = useMemo(
    () => tutorialSeries[currentTutorialIndex].tutorials[tutorialInnerStep].target,
    [currentTutorialIndex, tutorialInnerStep]
  )
  const maxChain = useMemo(
    () => tutorialSeries[currentTutorialIndex].tutorials[tutorialInnerStep].maxChain,
    [currentTutorialIndex, tutorialInnerStep]
  )

  const equalizerResult: number = useMemo(() => {
    if (chain.length === 0) return 0
    if (chain.length === 1) return Number(chain[0].getCount())
    const ops = {
      [ArithmeticCardTypes.SUMMATOR]: '+',
      [ArithmeticCardTypes.DIFFERENCATOR]: '-',
      [ArithmeticCardTypes.MULTIPLICATOR]: '*',
      [ArithmeticCardTypes.DENOMINATOR]: '/',
      [ArithmeticCardTypes.SWITCHER]: '/'
    }
    const strResult = chain.reduce(
      (a, p, i) =>
        a.concat(
          p.getCountNumber().toString(),
          i === chain.length - 1 ? '' : ops[tutorialStep as ArithmeticCardTypeEnum]
        ),
      ''
    )
    const result: number = eval(strResult)
    return result
  }, [chain])

  const isGameEnded = enemyHp <= targetEnemyHp

  const handleAddCard = ({ card, index }: AddCardProps) => {
    if (chain.length === maxChain) return
    if (!index) {
      const newArr = chain.concat(card)
      setChain(newArr)
      updateDeck(
        GAME_MODES.TUTORIAL,
        deck.filter((x) => x.getId().toString() !== card.getId().toString())
      )
    } else {
      const newArr = [...chain.slice(0, index), card, ...chain.slice(index)]
      setChain(newArr)
      updateDeck(
        GAME_MODES.TUTORIAL,
        deck.filter((x) => x.getId().toString() !== card.getId().toString())
      )
    }
  }

  const handleRemoveCard = ({ card, index }: AddCardProps) => {
    if (!index) {
      const newArr = deck.concat(card)
      updateDeck(GAME_MODES.TUTORIAL, newArr)
      setChain(chain.filter((x) => x.getId() !== card.getId()))
    } else {
      const newArr = [...deck.slice(0, index), card, ...deck.slice(index)]
      updateDeck(GAME_MODES.TUTORIAL, newArr)
      setChain(chain.filter((x) => x.getId() !== card.getId()))
    }
  }

  const handleEqual = () => {
    if (currentTutorialIndex < 0) return
    if (equalizerResult !== targetCount) {
      setSelectedCard(null)
      setError(`${formatNumber(equalizerResult)} is not equal ${formatNumber(targetCount)}, try again`)
      updateDeck(GAME_MODES.TUTORIAL, initialDeckStepPlus)
      setChain(initiaChain)
      return
    } else {
      setSelectedCard(null)
      setError(null)
      setEnemyHp(targetEnemyHp)
      return
    }
  }

  const handleStartAgain = () => {
    setChain(initiaChain)
    updateDeck(GAME_MODES.TUTORIAL, initialDeckStepPlus)
    setEnemyHp(INITIAL_ENEMY_HP)
  }

  const handleNextStep = () => {
    const allLocalTutorials = tutorialSeries[currentTutorialIndex].tutorials
    if (tutorialInnerStep >= allLocalTutorials.length - 1) {
      addMathOperator(tutorialStep)
      setTutorialInnerStep(0)
      handleNextMacroTutorial()
    } else {
      const newChain: CardType[] = allLocalTutorials[tutorialInnerStep + 1].chain
      const newDeck: CardType[] = allLocalTutorials[tutorialInnerStep + 1].cards
      setTutorialInnerStep(tutorialInnerStep + 1)
      setChain(newChain)
      updateDeck(GAME_MODES.TUTORIAL, newDeck)
      setEnemyHp(INITIAL_ENEMY_HP)
    }
  }

  const handleNextMacroTutorial = () => {
    const newIndex = currentTutorialIndex + 1
    if (newIndex < tutorialSeries.length) {
      const newChain: CardType[] = tutorialSeries[newIndex].tutorials[0].chain
      const newDeck: CardType[] = tutorialSeries[newIndex].tutorials[0].cards
      setChain(newChain)
      updateDeck(GAME_MODES.TUTORIAL, newDeck)
      setEnemyHp(INITIAL_ENEMY_HP)
      setTutorialInnerStep(0)
      setTutorialStep(tutorialSeries[newIndex].name)
    } else {
      setTutorialEnded(true)
    }
  }

  const handleSkip = () => {
    addMathOperator(tutorialStep)
    handleNextMacroTutorial()
  }

  const handleNextGameMode = () => {
    setGameMode(GAME_MODES.ARITHMETICS)
  }

  const handleRestartTutorial = () => {
    setTutorialInnerStep(0)
    setTutorialStep(ArithmeticCardTypes.SUMMATOR)
    setChain(INITIAL_CHAIN)
    updateDeck(GAME_MODES.TUTORIAL, INITIAL_DECK)
    setEnemyHp(INITIAL_ENEMY_HP)
    setTutorialEnded(false)
  }

  const handleEndGameClick = (card: CardType) => {
    if (card.getName() === RESTART_TUTORIAL_NAME) {
      handleRestartTutorial()
      return
    }
    if (card.getName() === CONTINUE_NAME) {
      handleNextGameMode()
      return
    }
    if (card.getName() === START_AGAIN_NAME) {
      handleStartAgain()
      return
    }
    if (card.getName() === CONTINUE_LESSON_NAME) {
      handleNextStep()
      return
    }
    if (card.getName() === SKIP_NAME) {
      handleSkip()
      return
    }
  }

  return (
    <>
      {tutorialEnded === true && (
        <>
          <div className='hps flex1'>
            <div>Tap the card to continue</div>
          </div>
          <div
            className={[selectedCard ? 'border' : '', 'win mt32'].join(' ')}
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
            <div>You completed tutorials!</div>
          </div>
          {selectedCard && (
            <GhostPreview
              deck={gameOverDeck}
              card={selectedCard}
              handleMouseUp={() => {
                if (selectedCard) {
                  setSelectedCard(null)
                }
              }}
            />
          )}
          <div
            className={[selectedCard ? 'border' : '', 'chain mt32'].join(' ')}
            style={{
              backgroundColor: selectedCard ? 'rgba(0, 255, 0,.3)' : ''
            }}
            onMouseUp={() => {
              if (selectedCard) {
                setSelectedCard(null)
              }
            }}
          >
            <CardsHand keys={gameOverDeck.map((x) => x.getId().toString())}>
              {gameOverDeck.map((x) => {
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
                    style={style}
                    handleCardClick={() => {
                      handleEndGameClick(x)
                      setSelectedCard(null)
                    }}
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
      {tutorialEnded === false && (
        <>
          {isGameEnded === true && (
            <div className='hps flex1'>
              <div>Tap the card to continue</div>
            </div>
          )}
          {isGameEnded === false && error === null && (
            <div className='hps'>
              <div>Play cards to reach result:</div>
              <div>{formatNumber(targetCount)}</div>
            </div>
          )}
          {isGameEnded === false && error !== null && (
            <div className='hps'>
              <div>{error}</div>
            </div>
          )}
          {isGameEnded === false && (
            <>
              {selectedCard && (
                <GhostPreview
                  deck={deck}
                  card={selectedCard}
                  handleMouseUp={() => {
                    if (selectedCard) {
                      setSelectedCard(null)
                    }
                  }}
                />
              )}
              <div className={['flex1 chainElem'].join(' ')}>
                {new Array(maxChain).fill(1).map((x, i) => {
                  const gapElement = (
                    <div>
                      <AdditionView
                        showPreview
                        card={
                          new ArithmeticCardTypeEnumToClass[tutorialSeries[currentTutorialIndex].name]({ name: '' })
                        }
                      />
                    </div>
                  )
                  if (chain.length > i && chain[i]) {
                    return (
                      <Fragment key={chain[i].getId()}>
                        {i > 0 ? gapElement : null}
                        <CardTypeView
                          card={chain[i]}
                          noAddition
                          className={['card noAddition'].join(' ')}
                          handleCardClick={() => {
                            handleRemoveCard({ card: chain[i], index: i })
                          }}
                          handleMouseDown={() => {
                            handleRemoveCard({ card: chain[i], index: i })
                            setSelectedCard((prev) => (prev?.getId() === chain[i].getId() ? null : chain[i]))
                          }}
                        />
                      </Fragment>
                    )
                  }
                  return (
                    <Fragment key={i}>
                      {i > 0 ? gapElement : null}
                      <CardTypeView
                        card={new Numberator()}
                        noAddition
                        className={[selectedCard ? 'border' : '', 'cardPlace noAddition'].join(' ')}
                        style={{
                          backgroundColor: selectedCard ? 'rgba(0, 255, 0,.3)' : '',
                          zIndex: 0
                        }}
                        // handleCardClick={() => {
                        //   handleRemoveCard({ card: x})
                        // }}
                        // handleCardClick={() => {
                        //   handleAddCard({card: x })
                        // }}
                        handleMouseUp={() => {
                          if (selectedCard) {
                            handleAddCard({ card: selectedCard })
                            setSelectedCard(null)
                          }
                        }}
                      />
                    </Fragment>
                  )
                })}
                {chain.length === maxChain && (
                  <div className='chainResultElem'>
                    <div className={['cardAddition', 'equalizer'].join(' ')}>
                      <div className='additionText'>=</div>
                    </div>
                    <div onClick={handleEqual} className='card'>
                      <div className='mainText'>
                        {equalizerResult.toString().indexOf('.') >= 0 ? equalizerResult.toFixed(2) : equalizerResult}
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                        // handleCardClick={() => handleAddCard({ card: x })}
                        noAddition
                        className='card noAddition'
                        style={style}
                        handleCardClick={() => {
                          handleAddCard({ card: x })
                        }}
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
                <div>Complete series or Skip to recieve new operator</div>
                <AdditionView
                  className='tutorialAdditionReward'
                  card={new ArithmeticCardTypeEnumToClass[tutorialStep]({ name: '' })}
                />
              </div>
              {selectedCard && (
                <GhostPreview
                  deck={lessonEndDeck}
                  card={selectedCard}
                  handleMouseUp={() => {
                    if (selectedCard) {
                      setSelectedCard(null)
                    }
                  }}
                />
              )}
              <div
                className={[selectedCard ? 'border' : '', 'chain mt32'].join(' ')}
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
                        style={style}
                        handleCardClick={() => {
                          handleEndGameClick(x)
                          setSelectedCard(null)
                        }}
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
      )}
    </>
  )
}
