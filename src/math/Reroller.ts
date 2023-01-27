import { CardType } from './CardType'
import { OperatorCard, OperatorCardProps } from './OperatorCard'

export class Reroller extends OperatorCard {
  constructor({ name = 'Reroller', card }: OperatorCardProps) {
    super({ name, card: new CardType({ name }) })
  }

  getName() {
    return this.getCard().getCount().toString()
  }

  getDescription() {
    return `reroll?\n${this.getCard().getCount().toString()}`
  }
}
