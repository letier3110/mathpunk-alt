import { CardType } from './CardType'
import { FormulaeCardType } from './formulae'
import { OperatorCard, OperatorCardProps } from './OperatorCard'
import { VectorCard } from './VectorCard'

export class Cosinusator extends OperatorCard {
  constructor({ name, card }: OperatorCardProps) {
    super({ name: 'Cosinusator', card })
  }

  getName() {
    return 'cos(x)'
  }
}
