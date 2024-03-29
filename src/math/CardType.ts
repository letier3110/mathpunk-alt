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
    this.id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
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

  getCountNumber() {
    if(this.count < 0) return `(-${Math.abs(this.count)})`
    return this.count.toString()
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