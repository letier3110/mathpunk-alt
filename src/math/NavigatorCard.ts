import { CardType } from './CardType'
import { FormulaeCardType } from './formulae'
import { OperatorCard, OperatorCardProps } from './OperatorCard'
import { VectorCard } from './VectorCard'

export class NavigatorCard extends OperatorCard {
  constructor({ name = 'Navigator', card }: OperatorCardProps) {
    super({ name, card: new CardType({ name }) })
  }
}
