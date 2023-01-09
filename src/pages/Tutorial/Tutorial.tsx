import { CSSProperties, FC, Fragment, useMemo, useState } from 'react'
import { AdditionView } from '../../components/AdditionView/AdditionView'
import { CardsHand } from '../../components/CardsHand/CardsHand'
import { CardTypeView } from '../../components/CardTypeView/CardTypeView'
import { ArithmeticCardTypeEnum, ArithmeticCardTypes } from '../../math/arithmetic'
import { CardType } from '../../math/CardType'
import { ArithmeticCardTypeEnumToClass, GAME_MODES } from '../../math/math'
import { Numberator } from '../../math/Numberator'
import { Navigator } from '../../math/Navigator'
import { Summator } from '../../math/Summator'
import { formatNumber } from '../../math/utils'
import { useGameModeContext } from '../../shared/GameState.constate'
import { useGhostPreviewContext } from '../../shared/GhostPreview.constate'
import { useInventoryContext } from '../Inventory/Inventory.constate'
import { INITIAL_CHAIN, INITIAL_DECK, INITIAL_ENEMY_HP, targetEnemyHp, tutorialSeries } from './Tutorial.const'
import { GhostPreview } from '../../components/GhostPreview/GhostPreview'
import { NavigatorTypeView } from '../../components/NavigatorTypeView/NavigatorTypeView'

interface AddCardProps {
  card: CardType
  index?: number
}

interface TutorialProps {
  //
}

const RESTART_TUTORIAL_NAME = 'Restart tutorial?'
const CONTINUE_NAME = 'Continue to actual gameplay?'

const START_AGAIN_NAME = 'Start tutorial again?'
const CONTINUE_LESSON_NAME = 'Continue to next lesson?'
const SKIP_NAME = 'Skip?'

const gameOverDeck = [
  // new Navigator('Continue')
  new Navigator(RESTART_TUTORIAL_NAME),
  new Navigator(CONTINUE_NAME)
]

const lessonEndDeck = [new Navigator(START_AGAIN_NAME), new Navigator(CONTINUE_LESSON_NAME), new Navigator(SKIP_NAME)]

export const Tutorial: FC<TutorialProps> = () => {
  const { setGameMode } = useGameModeContext()
  const { addMathOperator } = useInventoryContext()
  const { selectedCard, setSelectedCard } = useGhostPreviewContext()
  const [tutorialStep, setTutorialStep] = useState<ArithmeticCardTypeEnum>(tutorialSeries[0].name)
  const [tutorialInnerStep, setTutorialInnerStep] = useState(0)
  const [chain, setChain] = useState<CardType[]>(INITIAL_CHAIN)
  const [deck, setDeck] = useState<CardType[]>(INITIAL_DECK)
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
        a.concat(p.getCount().toString(), i === chain.length - 1 ? '' : ops[tutorialStep as ArithmeticCardTypeEnum]),
      ''
    )
    const result: number = eval(strResult)
    return result
  }, [chain])

  const isGameEnded = enemyHp <= targetEnemyHp

  const handleAddCard = ({ card, index }: AddCardProps) => {
    console.log('handleAdd', card)
    if (chain.length === maxChain) return
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

  const handleEqual = () => {
    if (currentTutorialIndex < 0) return
    if (equalizerResult !== targetCount) {
      setSelectedCard(null)
      setError(`${formatNumber(equalizerResult)} is not equal ${formatNumber(targetCount)}, try again`)
      setDeck(initialDeckStepPlus)
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
    setDeck(initialDeckStepPlus)
    setEnemyHp(INITIAL_ENEMY_HP)
  }

  const handleNextStep = () => {
    const allLocalTutorials = tutorialSeries[currentTutorialIndex].tutorials
    console.log('handleNextStep', tutorialInnerStep, allLocalTutorials.length - 1)
    if (tutorialInnerStep >= allLocalTutorials.length - 1) {
      addMathOperator(tutorialStep)
      handleNextMacroTutorial()
    } else {
      const newChain: CardType[] = allLocalTutorials[tutorialInnerStep + 1].chain
      const newDeck: CardType[] = allLocalTutorials[tutorialInnerStep + 1].cards
      setTutorialInnerStep(tutorialInnerStep + 1)
      setChain(newChain)
      setDeck(newDeck)
      setEnemyHp(INITIAL_ENEMY_HP)
    }
  }

  const handleNextMacroTutorial = () => {
    const newIndex = currentTutorialIndex + 1
    console.log('handleNextMacroTutorial', currentTutorialIndex + 1, tutorialSeries.length)
    if (newIndex < tutorialSeries.length) {
      const newChain: CardType[] = tutorialSeries[newIndex].tutorials[0].chain
      const newDeck: CardType[] = tutorialSeries[newIndex].tutorials[0].cards
      setChain(newChain)
      setDeck(newDeck)
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
    setDeck(INITIAL_DECK)
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
    <div className='root'>
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
                    handleCardClick={() => {
                      handleEndGameClick(x)
                      setSelectedCard(null)
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
                          // handleCardClick={() => handleRemoveCard({ card: chain[i], index: i })}
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
                        handleMouseUp={() => {
                          if (selectedCard) {
                            // handleEndGameClick(selectedCard)
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
                        handleCardClick={() => handleAddCard({ card: x })}
                        noAddition
                        className='card noAddition'
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
                        handleCardClick={() => {
                          handleEndGameClick(x)
                          setSelectedCard(null)
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
        </>
      )}
    </div>
  )
}
