import { useState } from 'react'

import './App.css'

enum CardTypeEnum {
  DENOMINATOR,
  SUMMATOR,
  MULTIPLICATOR,
  DIFFERENCATOR,
  NUMBERATOR
}

type Indexable = string | number | symbol

const StartCardPool: Record<CardTypeEnum, number> = {
  [CardTypeEnum.DENOMINATOR]: 1,
  [CardTypeEnum.SUMMATOR]: 1,
  [CardTypeEnum.MULTIPLICATOR]: 1,
  [CardTypeEnum.DIFFERENCATOR]: 1,
  [CardTypeEnum.NUMBERATOR]: 3,
}

interface IComputable {
  calculate(x: number, y: number): number
}

interface CardTypeProps {
  name: string
}

class CardType {
  private name: string
  constructor({ name }: CardTypeProps) {
    this.name = name
  }

  getName() {
    return this.name
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

interface NumberatorProps {
  count: number
}

class Numberator extends CardType {
  private count: number

  constructor() {
    super({ name: 'Numberator' })
    this.count = 0
  }

  setCount(count: number) {
    this.count = count
  }

  getName() {
    return this.count.toString()
  }
}

const CardTypeEnumToClass: Record<CardTypeEnum, typeof CardType> = {
  [CardTypeEnum.DENOMINATOR]: Denominator,
  [CardTypeEnum.SUMMATOR]: Summator,
  [CardTypeEnum.MULTIPLICATOR]: Multiplicator,
  [CardTypeEnum.DIFFERENCATOR]: Differencator,
  [CardTypeEnum.NUMBERATOR]: Numberator
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

const MIN_TARGET_VALUE = 100
const MAX_TARGET_VALUE = 500

const generateTarget = (): number => {
  return Math.floor(Math.random() * (MAX_TARGET_VALUE - MIN_TARGET_VALUE) + MIN_TARGET_VALUE)
}

// const generateDenominator = (): number => {
//   return Math.floor(Math.random() * (MAX_TARGET_VALUE - MIN_TARGET_VALUE) + MIN_TARGET_VALUE)
// }

const getDeckPool = (): CardType[] => {
  const array = Array(5).fill((x: number) => x);
  const res = array.map((): CardType => {
    const result = new CardTypeEnumToClass[(weightedRand<CardTypeEnum>(StartCardPool))()]({name:''});
    if(result instanceof Numberator) {
      result.setCount(generateTarget());
    }
    console.log(result);
    return result;
  });
  return res;
}

function App() {
  const [count] = useState(generateTarget())
  const [deck, setDeck] = useState<CardType[]>(getDeckPool())

  console.log(deck)

  return (
    <div className='root'>
      <div className='count'>{count}</div>
      <div className='cards'>
        {deck.map((x, index) => {
          const translateY = Math.abs(-Math.floor(deck.length / 2) + index);
          const rotate = -Math.floor(deck.length / 2)
          return (<div style={{
            rotate: `${(rotate + index) * 10}deg`,
            translate: `0px ${(translateY*translateY) * 12}px`,
          }} className='card'>{x.getName()}</div>)
        })}
      </div>
    </div>
  )
}

export default App
