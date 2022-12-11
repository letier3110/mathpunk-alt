import { useMemo, useState } from 'react'

import './App.css'

enum CardTypeEnum {
  DENOMINATOR,
  SUMMATOR,
  MULTIPLICATOR,
  DIFFERENCATOR
  // NUMBERATOR
}

type Indexable = string | number | symbol

const StartCardPool: Record<CardTypeEnum, number> = {
  [CardTypeEnum.DENOMINATOR]: 1,
  [CardTypeEnum.SUMMATOR]: 1,
  [CardTypeEnum.MULTIPLICATOR]: 1,
  [CardTypeEnum.DIFFERENCATOR]: 1
  // [CardTypeEnum.NUMBERATOR]: 3,
}

interface IComputable {
  calculate(x: number, y: number): number
}

interface CardTypeProps {
  name: string
}

interface ICardType {
  setCount(count: number): void
  getId(): number
  getName(): string
  getDescription(): string
  getCount(): string
}

interface ViewChainElem extends ICardType {
  isOperator: boolean
}

class CardType implements ICardType {
  private id: number
  private name: string
  private count: number
  constructor({ name }: CardTypeProps) {
    this.name = name
    this.count = 0
    this.id = Math.random() * Number.MAX_SAFE_INTEGER
  }

  setCount(count: number) {
    this.count = count
  }

  getId() {
    return this.id
  }

  getName() {
    return this.count.toString()
  }

  getCount() {
    return this.count.toString()
  }

  getDescription() {
    return this.name
  }
}

class Denominator extends CardType implements IComputable {
  constructor() {
    super({ name: 'Denominator' })
  }

  getName() {
    return '/'
  }

  calculate(x: number, y: number): number {
    return x / y
  }
}

class Multiplicator extends CardType implements IComputable {
  constructor() {
    super({ name: 'Multiplicator' })
  }

  getName() {
    return '*'
  }

  calculate(x: number, y: number): number {
    return x * y
  }
}

class Summator extends CardType implements IComputable {
  constructor() {
    super({ name: 'Summator' })
  }

  getName() {
    return '+'
  }

  calculate(x: number, y: number): number {
    return x + y
  }
}

class Differencator extends CardType implements IComputable {
  constructor() {
    super({ name: 'Differencator' })
  }

  getName() {
    return '-'
  }

  calculate(x: number, y: number): number {
    return x - y
  }
}

// interface NumberatorProps {
//   count: number
// }

// class Numberator extends CardType {
//   private count: number

//   constructor() {
//     super({ name: 'Numberator' })
//     this.count = 0
//   }

//   setCount(count: number) {
//     this.count = count
//   }

//   getName() {
//     return this.count.toString()
//   }
// }

const CardTypeEnumToClass: Record<CardTypeEnum, typeof CardType> = {
  [CardTypeEnum.DENOMINATOR]: Denominator,
  [CardTypeEnum.SUMMATOR]: Summator,
  [CardTypeEnum.MULTIPLICATOR]: Multiplicator,
  [CardTypeEnum.DIFFERENCATOR]: Differencator
  // [CardTypeEnum.NUMBERATOR]: Numberator
}

// https://stackoverflow.com/questions/8435183/generate-a-weighted-random-number
function weightedRand<T extends Indexable>(spec: Record<T, number>): () => T {
  const table: T[] = []
  for (const i in spec) {
    // The constant 10 below should be computed based on the
    // weights in the spec for a correct and optimal table size.
    // E.g. the spec {0:0.999, 1:0.001} will break this impl.
    for (let j = 0; j < spec[i] * 10; j++) {
      table.push(i)
    }
  }
  return function () {
    return table[Math.floor(Math.random() * table.length)]
  }
}

enum DIFFICULTIES {
  EASY = 'easy',
  HARD = 'hard'
}

interface DifficultySettings {
  minTargetValue: number;
  maxTargetValue: number;
  minNumenatorValue: number;
  maxNumenatorValue: number;
  preciseness: number;
}

const VALUES: Record<DIFFICULTIES, DifficultySettings> = {
  [DIFFICULTIES.EASY]: {
    minTargetValue: 5,
    maxTargetValue: 15,
    minNumenatorValue: 1,
    maxNumenatorValue: 20,
    preciseness: 50,
  },
  [DIFFICULTIES.HARD]: {
    minTargetValue: 2000,
    maxTargetValue: 8000,
    minNumenatorValue: 100,
    maxNumenatorValue: 999,
    preciseness: 25,
  }
}

let latestTarget = 0

const generateTarget = (hardMode = false): number => {
  const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY;
  const min = VALUES[mode].minTargetValue;
  const max = VALUES[mode].maxTargetValue;
  latestTarget = Math.floor(Math.random() * (max - min) + min)
  return latestTarget
}

const generateNumenator = (hardMode = false): number => {
  const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY;
  const min = VALUES[mode].minNumenatorValue;
  const max = VALUES[mode].maxNumenatorValue;
  let res = Math.floor(Math.random() * (max - min) + min)
  while (res === latestTarget) {
    res = Math.floor(Math.random() * (max - min) + min)
  }
  return res
}

interface AddCardProps {
  card: CardType
  index?: number
}

const getDeckPool = (hardMode = false): CardType[] => {
  const array = Array(5).fill((x: number) => x)
  const res = array.map((): CardType => {
    const result = new CardTypeEnumToClass[weightedRand<CardTypeEnum>(StartCardPool)()]({ name: '' })
    result.setCount(generateNumenator(hardMode))
    return result
  })
  return res
}

function App() {
  const [hardMode, setHardMode] = useState<boolean>(false)
  const [count, setCount] = useState(generateTarget())
  const [tutorialMode, setTutorialMode] = useState<boolean>(false)
  const [hp, setHp] = useState(10)
  const [enemyHp, setEnemyHp] = useState(10)
  const [round, setRound] = useState<number>(1)
  const [chain, setChain] = useState<CardType[]>([])
  const [deck, setDeck] = useState<CardType[]>(getDeckPool())

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
  const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY;
  const preciseness = VALUES[mode].preciseness;

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
    setCount(generateTarget(hardMode))
    setRound(round + 1)
    setChain([])
    setDeck(getDeckPool(hardMode))
  }

  const handleStartNewGame = () => {
    setCount(generateTarget(hardMode))
    setRound(1)
    setChain([])
    setDeck(getDeckPool(hardMode))
    setEnemyHp(10)
  }

  const handleEqual = () => {
    if (equalizerResult === count) {
      setEnemyHp(enemyHp - 5)
      handleStartNewRound()
      return
    }
    const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY;
    const preciseness = VALUES[mode].preciseness / 100;
    if (equalizerResult > count * (1 - preciseness) && equalizerResult < count * (1 + preciseness)) {
      const res = Math.round((1 - Math.abs((equalizerResult - count) / count)) * 5)
      console.log(res)
      setEnemyHp(enemyHp - res)
    } else {
      setEnemyHp(enemyHp + 5)
    }
    handleStartNewRound()
  }

  // console.log('value', tutorialMode)

  return (
    <div className='root'>
      {tutorialMode && (<div className='sidebar'>
        <div>
          1. Select and click card from the bottom of the screen. Bottom of the screen is represents your HAND.
        </div>
        <div>
          2. Combine your cards to achieve value as close as you can to the target. 
        </div>
        <div>
          3. In order to win, you need to make correct guesses and lower points to zero.
        </div>
        <div>
          4. Your value must consist {100 - preciseness}% of target's value. Otherwise points will grow, pushing away victory of the game.
        </div>
        <div>
          5. To confirm your value - click on the card after equals (=) sign. 
        </div>
      </div>)}
      <div>
        Tutorial mode?
        <input type='checkbox' value={tutorialMode + ''} onChange={(e) => setTutorialMode(e.target.checked)} />
        {/* {tutorialMode && <div className='tutorialText'>LABELS WITH THIS FONT ARE FOR TUTORIAL</div>} */}
      </div>
      <div className='hps'>
        {/* <div>
          Your points:
          {hp}
        </div> */}
        {/* <div>
          Round:
          {round}
        </div> */}
        <div>
          Remaining points to beat:
          {enemyHp}
        </div>
      </div>
      {isGameEnded === false && (
        <>
          <div className='count'>{count}</div>
          {chain.length > 0 && (
            <div className='chain'>
              {chain.map((x) => {
                return (
                  <div key={x.getId()} className='chainElem'>
                    <div onClick={() => handleRemoveCard({ card: x })} className='card noAddition'>
                      <div className='mainText'>{x.getCount()}</div>
                      <div className={['addition', x.getDescription()].join(' ')}>
                        <div className='additionText'>{x.getName()}</div>
                      </div>
                    </div>
                    <div className={['cardAddition', x.getDescription()].join(' ')}>
                      <div className='additionText'>{x.getName()}</div>
                    </div>
                  </div>
                )
              })}
              {chain.length > 0 && (
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
          )}
          {/* {tutorialMode && chain.length > 0 && (<div className='tutorialText'>CLICK ON THE CARD RESULT CARD TO APPLY IT</div>)} */}
          <div className='cards'>
            {deck.map((x, index) => {
              const translateY = Math.abs(-Math.floor(deck.length / 2) + index)
              const rotate = -Math.floor(deck.length / 2)
              return (
                <div
                  key={x.getId()}
                  className='card'
                  style={{
                    rotate: `${(rotate + index) * 10}deg`,
                    translate: `0px ${translateY * translateY * 12}px`
                  }}
                  onClick={() => handleAddCard({ card: x })}
                >
                  <div className='mainText'>{x.getCount()}</div>
                  <div className={['addition', x.getDescription()].join(' ')}>
                    <div className='additionText'>{x.getName()}</div>
                  </div>
                </div>
              )
            })}
          </div>
          {/* {tutorialMode && deck.length > 0 && <div className='tutorialText'>CLICK ON THE CARD TO PLAY IT</div>} */}
        </>
      )}
      {isGameEnded === true && (
        <div className='win'>
          <div>🥳🥳🥳</div>
          <div>You won!</div>
          <div>
            Hard mode?
            <input type='checkbox' value={hardMode + ''} onChange={(e) => setHardMode(!hardMode)} />
          </div>
          {tutorialMode && <div className='tutorialText'>PRESS THE CARD TO START NEW GAME</div>}
          <div className='card' onClick={handleStartNewGame}>
            Start new game?
          </div>
        </div>
      )}
    </div>
  )
}

export default App
