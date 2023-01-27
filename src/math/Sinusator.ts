import { CardType } from './CardType'
import { FormulaeCardType } from './formulae'
import { OperatorCard, OperatorCardProps } from './OperatorCard'
import { VectorCard } from './VectorCard'

export class Sinusator extends OperatorCard {
  constructor({ name, card }: OperatorCardProps) {
    super({ name: 'Sinusator', card })
  }

  getName() {
    return 'sin(x)'
  }
}
