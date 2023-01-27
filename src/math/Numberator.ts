import { IComputable } from './arithmetic'
import { CardType } from './CardType'
import { FormulaeCardType } from './formulae'
import { OperatorCard, OperatorCardProps } from './OperatorCard'
import { VectorCard } from './VectorCard'

export class Numberator extends OperatorCard implements IComputable {
  constructor({ name, card }: OperatorCardProps) {
    super({ name: 'Numberator', card })
  }

  getName() {
    return this.getCard().getCount().toString()
  }

  getDescription() {
    return this.getCard().getCount().toString()
  }

  calculate(x: number, y: number): number {
    return x - y
  }
}
