import { useState } from 'react'

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

class CardType {
  private id: number
  private name: string
  private count: number
  constructor({ name }: CardTypeProps) {
    this.name = name
    this.count = 0
    this.id = Math.random() * 12345678;
  }

  
  setCount(count: number) {
    this.count = count
  }
  
  getId() {
    return this.id;
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

const MIN_TARGET_VALUE = 5
const MAX_TARGET_VALUE = 15

const generateTarget = (): number => {
  return Math.floor(Math.random() * (MAX_TARGET_VALUE - MIN_TARGET_VALUE) + MIN_TARGET_VALUE)
}

const MIN_NUMENATOR_VALUE = 1
const MAX_NUMENATOR_VALUE = 20
const generateNumenator = (): number => {
  return Math.floor(Math.random() * (MAX_NUMENATOR_VALUE - MIN_NUMENATOR_VALUE) + MIN_NUMENATOR_VALUE)
}

interface AddCardProps {
  card: CardType
  index?: number
}

const getDeckPool = (): CardType[] => {
  const array = Array(5).fill((x: number) => x)
  const res = array.map((): CardType => {
    const result = new CardTypeEnumToClass[weightedRand<CardTypeEnum>(StartCardPool)()]({ name: '' })
    // if(result instanceof Numberator) {
    result.setCount(generateNumenator())
    // }
    console.log(result)
    return result
  })
  return res
}

function App() {
  const [count, setCount] = useState(generateTarget())
  const [round, setRound] = useState<number>(1)
  const [chain, setChain] = useState<CardType[]>([])
  const [deck, setDeck] = useState<CardType[]>(getDeckPool())

  console.log(deck)

  const handleAddCard = ({ card, index = 0 }: AddCardProps) => {
    const newArr = [...chain.slice(0, index), card, ...chain.slice(index)];
    setChain(newArr)
    setDeck(deck.filter(x => x.getId() !== card.getId()))
  }

  const handleRemoveCard = ({ card, index = 0 }: AddCardProps) => {
    const newArr = [...deck.slice(0, index), card, ...deck.slice(index)];
    setDeck(newArr)
    setChain(chain.filter(x => x.getId() !== card.getId()))
  }

  return (
    <div className='root'>
      <div className='count'>{count}</div>
      {chain.length > 0 && <div className='chain'>{chain.map((x, index) => {
          return (
            <div
            onClick={() => handleRemoveCard({ card: x, index })}
              className='card'
            >
              <div className='mainText'>{x.getCount()}</div>
              <div className={['addition', x.getDescription()].join(' ')}>
                <div className='additionText'>{x.getName()}</div>
              </div>
            </div>
          )
        })}</div>}
      <div className='cards'>
        {deck.map((x, index) => {
          const translateY = Math.abs(-Math.floor(deck.length / 2) + index)
          const rotate = -Math.floor(deck.length / 2)
          return (
            <div
              onClick={() => handleAddCard({ card: x, index })}
              style={{
                rotate: `${(rotate + index) * 10}deg`,
                translate: `0px ${translateY * translateY * 12}px`
              }}
              className='card'
            >
              <div className='mainText'>{x.getCount()}</div>
              <div className={['addition', x.getDescription()].join(' ')}>
                <div className='additionText'>{x.getName()}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
