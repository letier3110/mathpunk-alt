import { CardType } from './CardType'
import { FormulaeCardType } from './formulae'
import { OperatorCard, OperatorCardProps } from './OperatorCard'
import { VectorCard } from './VectorCard'

export class FNumberator extends OperatorCard {
  constructor({ name, card }: OperatorCardProps) {
    super({ name: 'FNumberator', card })
  }

  getName() {
    return this.getCard().getCount().toString()
  }
}
