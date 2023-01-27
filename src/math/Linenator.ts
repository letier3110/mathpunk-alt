import { CardType } from './CardType'
import { FormulaeCardType } from './formulae'
import { OperatorCard, OperatorCardProps } from './OperatorCard'
import { VectorCard } from './VectorCard'

export class Linenator extends OperatorCard {
  constructor({ name, card }: OperatorCardProps) {
    super({ name: 'Linenator', card })
  }

  getName() {
    return 'x'
  }
}
