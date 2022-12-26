import { FC, Fragment, useMemo, useState } from 'react'
import { AdditionView } from '../../components/AdditionView/AdditionView'
import { CardsHand } from '../../components/CardsHand/CardsHand'
import { CardTypeView } from '../../components/CardTypeView/CardTypeView'
import { ArithmeticCardTypeEnum, ArithmeticCardTypes, CardType } from '../../math/arithmetic'
import { ArithmeticCardTypeEnumToClass, GAME_MODES } from '../../math/math'
import { Numberator } from '../../math/Numberator'
import { Summator } from '../../math/Summator'
import { formatNumber } from '../../math/utils'
import { useGameModeContext } from '../../shared/GameState.constate'
import { useInventoryContext } from '../Inventory/Inventory.constate'

interface AddCardProps {
  card: CardType
  index?: number
}

interface TutorialProps {
  //
}

interface TutorialEntity {
  target: number
  maxChain: number
  cards: CardType[]
  chain: CardType[]
}

interface TutorialSetup {
  name: ArithmeticCardTypeEnum
  tutorials: TutorialEntity[]
}

const summatorTutorials: TutorialEntity[] = [
  {
    target: 4,
    maxChain: 2,
    cards: [new Numberator(1), new Numberator(2), new Numberator(3)],
    chain: []
  },
  {
    target: 6,
    maxChain: 2,
    cards: [new Numberator(1), new Numberator(2), new Numberator(3), new Numberator(4)],
    chain: []
  },
  {
    target: 10,
    maxChain: 3,
    cards: [new Numberator(1), new Numberator(2), new Numberator(3), new Numberator(5)],
    chain: []
  },
  {
    target: 50,
    maxChain: 3,
    cards: [new Numberator(12), new Numberator(23), new Numberator(18), new Numberator(15), new Numberator(15)],
    chain: []
  }
]

const differencatorTutorials: TutorialEntity[] = [
  {
    target: 1,
    maxChain: 2,
    cards: [new Numberator(5), new Numberator(2), new Numberator(3), new Numberator(4)],
    chain: []
  },
  {
    target: 5,
    maxChain: 2,
    cards: [new Numberator(7), new Numberator(17), new Numberator(21), new Numberator(12)],
    chain: []
  },
  {
    target: 2,
    maxChain: 2,
    cards: [new Numberator(19), new Numberator(31), new Numberator(-5), new Numberator(-7)],
    chain: []
  },
  {
    target: 50,
    maxChain: 2,
    cards: [new Numberator(12), new Numberator(-23), new Numberator(-18), new Numberator(55), new Numberator(5)],
    chain: []
  }
]

const multiplicatorTutorials: TutorialEntity[] = [
  {
    target: 10,
    maxChain: 2,
    cards: [new Numberator(5), new Numberator(2), new Numberator(3), new Numberator(4)],
    chain: []
  },
  {
    target: 21 * 17,
    maxChain: 2,
    cards: [new Numberator(7), new Numberator(17), new Numberator(21), new Numberator(12)],
    chain: []
  },
  {
    target: -5 * 31 * 19,
    maxChain: 3,
    cards: [new Numberator(19), new Numberator(31), new Numberator(-5), new Numberator(-7)],
    chain: []
  },
  {
    target: -32 * -18,
    maxChain: 2,
    cards: [new Numberator(-32), new Numberator(-23), new Numberator(-18), new Numberator(55), new Numberator(5)],
    chain: []
  }
]

const denominatorTutorials: TutorialEntity[] = [
  {
    target: 5 / 2,
    maxChain: 2,
    cards: [new Numberator(5), new Numberator(2), new Numberator(3), new Numberator(4)],
    chain: []
  },
  {
    target: 17 / 21,
    maxChain: 2,
    cards: [new Numberator(7), new Numberator(17), new Numberator(21), new Numberator(12)],
    chain: []
  },
  {
    target: -7 / 19 / 31,
    maxChain: 3,
    cards: [new Numberator(19), new Numberator(31), new Numberator(-5), new Numberator(-7)],
    chain: []
  },
  {
    target: -23 / -18,
    maxChain: 2,
    cards: [new Numberator(12), new Numberator(-23), new Numberator(-18), new Numberator(55), new Numberator(5)],
    chain: []
  }
]

const tutorialSeries: TutorialSetup[] = [
  {
    name: ArithmeticCardTypes.SUMMATOR,
    tutorials: summatorTutorials
  },
  {
    name: ArithmeticCardTypes.DIFFERENCATOR,
    tutorials: differencatorTutorials
  },
  {
    name: ArithmeticCardTypes.MULTIPLICATOR,
    tutorials: multiplicatorTutorials
  },
  {
    name: ArithmeticCardTypes.DENOMINATOR,
    tutorials: denominatorTutorials
  }
]

const INITIAL_CHAIN: CardType[] = tutorialSeries[0].tutorials[0].chain
const INITIAL_DECK: CardType[] = tutorialSeries[0].tutorials[0].cards
const INITIAL_ENEMY_HP = 10
const targetEnemyHp = 0

export const Tutorial: FC<TutorialProps> = () => {
  const { setGameMode } = useGameModeContext()
  const { addMathOperator } = useInventoryContext()
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
      setError(`${formatNumber(equalizerResult)} is not equal ${formatNumber(targetCount)}, try again`)
      setDeck(initialDeckStepPlus)
      setChain(initiaChain)
      return
    } else {
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

  return (
    <>
      <div className='root'>
        {tutorialEnded === true && (
          <>
            <div className='hps flex1'>
              <div>Tap the card to continue</div>
            </div>
            <div className='win mt32'>
              <div>🥳🥳🥳</div>
              <div>You completed tutorials!</div>
            </div>
            <div className='chain mt32'>
              <CardsHand keys={['1', '2', '3']}>
                <div className='card' onClick={handleRestartTutorial}>
                  Restart tutorial?
                </div>
                <div className='card' onClick={handleNextGameMode}>
                  Continue to actual gameplay?
                </div>
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
                <div className='flex1 chainElem'>
                  {new Array(maxChain).fill(1).map((x, i) => {
                    const gapElement = (
                      <div className=''>
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
                            className='card noAddition'
                            handleCardClick={() => handleRemoveCard({ card: chain[i], index: i })}
                          />
                        </Fragment>
                      )
                    }
                    return (
                      <Fragment key={i}>
                        {i > 0 ? gapElement : null}
                        <CardTypeView card={new Numberator()} noAddition className='cardPlace noAddition' />
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
                <CardsHand keys={deck.map((x) => x.getId().toString())}>
                  {deck.map((x) => (
                    <CardTypeView
                      key={x.getId()}
                      card={x}
                      handleCardClick={() => handleAddCard({ card: x })}
                      noAddition
                      className='card noAddition'
                    />
                  ))}
                </CardsHand>
              </>
            )}
            {isGameEnded === true && (
              <>
                <div className='win'>
                  <div>🥳🥳🥳</div>
                  <div>You won!</div>
                </div>
                <div className='chain mt32'>
                  <CardsHand keys={['1', '2', '3']}>
                    <div className='card' onClick={handleStartAgain}>
                      Start tutorial again?
                    </div>
                    <div className='card' onClick={handleNextStep}>
                      Continue to next lesson?
                    </div>
                    <div className='card' onClick={handleSkip}>
                      Skip?
                    </div>
                  </CardsHand>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}
