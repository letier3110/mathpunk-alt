import { CardType } from './CardType'
import { VectorCard } from './VectorCard'

interface OperatorCardProps {
  name: string
  card: CardType | VectorCard
}

interface IOperatorCard {
  getCard(): CardType | VectorCard
}

export class OperatorCard implements IOperatorCard {
  private id: number
  private name: string
  private card: CardType | VectorCard
  constructor({ name, card }: OperatorCardProps) {
    this.name = name
    this.card = card
    this.id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  }

  setCard(card: CardType | VectorCard) {
    this.card = card
  }

  getCard() {
    return this.card
  }

  setName(name: string) {
    this.name = name
  }

  getName() {
    return this.name.toString()
  }

  // getCountNumber() {
  //   if(this.count < 0) return `(-${Math.abs(this.count)})`
  //   return this.count.toString()
  // }

  // getCount() {
  //   return this.count.toString()
  // }

  getDescription() {
    return this.name
  }

  getIsInteractive() {
    return false
  }
}
