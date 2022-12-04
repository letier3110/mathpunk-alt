import { useState } from 'react'

import './App.css'

// enum CardType {
//   DENOMINATOR,
//   SUM,
//   MULTIPLICATION
// }

// https://stackoverflow.com/questions/8435183/generate-a-weighted-random-number
function weightedRand<T>(spec: Record<T, number>): () => T {
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

const StartCardPool: Record<CardType, number> = {
  Denominator: 1
}

const getDeckPool = (): CardType[] => {
  return Array(5).fill(() => weightedRand<CardType>(StartCardPool)());
}

function App() {
  const [count] = useState(generateTarget())
  const [deck, setDeck] = useState<CardType[]>(getDeckPool())

  return (
    <div>
      <div>{count}</div>
      <div>
        {deck.map(x => {
          return (<div>{x.getName()}</div>)
        })}
      </div>
    </div>
  )
}

const MIN_TARGET_VALUE = 100
const MAX_TARGET_VALUE = 500

const generateTarget = (): number => {
  return Math.floor(Math.random() * (MAX_TARGET_VALUE - MIN_TARGET_VALUE) + MIN_TARGET_VALUE)
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

  constructor({ count }: NumberatorProps) {
    super({ name: 'Numberator' })
    this.count = count
  }

  getName() {
    return this.count.toString()
  }
}

export default App
