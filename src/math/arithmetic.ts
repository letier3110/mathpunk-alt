export const ArithmeticCardTypes = {
  DENOMINATOR: 'DENOMINATOR',
  SUMMATOR: 'SUMMATOR',
  MULTIPLICATOR: 'MULTIPLICATOR',
  DIFFERENCATOR: 'DIFFERENCATOR',
  SWITCHER: 'SWITCHER'
  // NUMBERATOR
} as const;

type ObjectValues<T> = T[keyof T]

export type ArithmeticCardTypeEnum = ObjectValues<typeof ArithmeticCardTypes>

export interface IComputable {
  calculate(x: number, y: number): number
}

export interface IChangable<T> {
  getChangableState(): T
  getNextPossibleValue(): T
  setChangableState(value: T): void
}

export function instanceOfChangable<T>(object: any): object is IChangable<T> {
  return 'getChangableState' in object
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

  setName(name: string) {
    this.name = name
  }

  getName() {
    return this.name.toString()
  }

  getCount() {
    return this.count.toString()
  }

  getDescription() {
    return this.name
  }

  getIsInteractive() {
    return false
  }
}

export enum SwitcherValue {
  DENOMINATOR = 'DENOMINATOR',
  MULTIPLICATOR = 'MULTIPLICATOR',
  SUMMATOR = 'SUMMATOR',
  DIFFERENCATOR = 'DIFFERENCATOR'
}
