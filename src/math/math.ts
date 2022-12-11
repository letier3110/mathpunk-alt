// /**
//  * source
//  * https://stackoverflow.com/questions/13077923/how-can-i-convert-a-string-into-a-math-operator-in-javascript
//  */

// // var math_it_up = {
// //     '+': function (x, y) { return x + y },
// //     '-': function (x, y) { return x - y }
// // }​​​​​​​;
// // math_it_up['+'](1, 2) == 3;

// export enum MathOperations {
//     PLUS = '+',
//     MINUS = '-'
// }

// // class MathModule {
// //     private string
// //     constructor() {

// //     }

// // }

// // export const mathModule = new MathModule();

// export const math_it_up = {
//     [MathOperations.PLUS]: function (x: number, y: number) { return x + y },
//     [MathOperations.MINUS]: function (x: number, y: number) { return x - y }
// }

export enum CardTypeEnum {
  DENOMINATOR,
  SUMMATOR,
  MULTIPLICATOR,
  DIFFERENCATOR
  // NUMBERATOR
}

type Indexable = string | number | symbol

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

export class CardType implements ICardType {
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

export class Denominator extends CardType implements IComputable {
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

export class Multiplicator extends CardType implements IComputable {
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

export class Summator extends CardType implements IComputable {
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

export class Differencator extends CardType implements IComputable {
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

export const CardTypeEnumToClass: Record<CardTypeEnum, typeof CardType> = {
  [CardTypeEnum.DENOMINATOR]: Denominator,
  [CardTypeEnum.SUMMATOR]: Summator,
  [CardTypeEnum.MULTIPLICATOR]: Multiplicator,
  [CardTypeEnum.DIFFERENCATOR]: Differencator
  // [CardTypeEnum.NUMBERATOR]: Numberator
}

// https://stackoverflow.com/questions/8435183/generate-a-weighted-random-number
export function weightedRand<T extends Indexable>(spec: Record<T, number>): () => T {
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

export enum DIFFICULTIES {
  EASY = 'easy',
  HARD = 'hard'
}

export enum GAME_MODES {
  ARITHMETICS = 'arithmetic',
  PLOTTING = 'plotting'
}

export interface DifficultySettings {
  minTargetValue: number
  maxTargetValue: number
  minNumenatorValue: number
  maxNumenatorValue: number
  preciseness: number
}
