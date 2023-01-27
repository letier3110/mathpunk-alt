import { CardType } from './CardType'
import { FormulaeCardType } from './formulae'
import { OperatorCard, OperatorCardProps } from './OperatorCard'
import { VectorCard } from './VectorCard'

export class Squarerator extends OperatorCard {
  constructor({ name, card }: OperatorCardProps) {
    super({ name: 'Squarerator', card })
  }

  getName() {
    return 'x^(2)'
  }
}
