import { ArithmeticCardTypeEnum, CardType, IComputable } from "./arithmetic"
import { FormulaeCardType, FormulaeCardTypeEnum } from "./formulae"

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

export class Linenator extends FormulaeCardType {
  constructor() {
    super({ name: 'Linenator', addition: new CardType({name: ''}) })
  }

  getName() {
    return '(x)'
  }
}

export class Squarerator extends FormulaeCardType {
  constructor() {
    super({ name: 'Squarerator', addition: new CardType({name: ''}) })
  }

  getName() {
    return '(x^2)'
  }
}

export class Cosinusator extends FormulaeCardType {
  constructor() {
    super({ name: 'Cosinusator', addition: new CardType({name: ''}) })
  }

  getName() {
    return '(cos(x))'
  }
}

export class Sinusator extends FormulaeCardType {
  constructor() {
    super({ name: 'Sinusator', addition: new CardType({name: ''}) })
  }

  getName() {
    return '(sin(x))'
  }
}


export const ArithmeticCardTypeEnumToClass: Record<ArithmeticCardTypeEnum, typeof CardType> = {
  [ArithmeticCardTypeEnum.DENOMINATOR]: Denominator,
  [ArithmeticCardTypeEnum.SUMMATOR]: Summator,
  [ArithmeticCardTypeEnum.MULTIPLICATOR]: Multiplicator,
  [ArithmeticCardTypeEnum.DIFFERENCATOR]: Differencator,
  [ArithmeticCardTypeEnum.SWITCHER]: CardType
  // [CardTypeEnum.NUMBERATOR]: Numberator
}

export const FormulaeCardTypeEnumToClass: Record<FormulaeCardTypeEnum, typeof FormulaeCardType> = {
  [FormulaeCardTypeEnum.LINENATOR]: Linenator,
  // [FormulaeCardTypeEnum.DOUBLE_LINENATOR]: Denominator,
  [FormulaeCardTypeEnum.SQUARERATOR]: Squarerator,
  [FormulaeCardTypeEnum.SINUSATOR]: Sinusator,
  [FormulaeCardTypeEnum.COSINUSATOR]: Cosinusator
  // [CardTypeEnum.NUMBERATOR]: Numberator
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
