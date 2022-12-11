export enum ArithmeticCardTypeEnum {
  DENOMINATOR,
  SUMMATOR,
  MULTIPLICATOR,
  DIFFERENCATOR,
  SWITCHER
  // NUMBERATOR
}

export interface IComputable {
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
    return this.name.toString()
  }

  getCount() {
    return this.count.toString()
  }

  getDescription() {
    return this.name
  }
}
