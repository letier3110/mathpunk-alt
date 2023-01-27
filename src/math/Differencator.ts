import { IComputable } from './arithmetic'
import { CardType } from './CardType'
import { FormulaeCardType } from './formulae'
import { OperatorCard, OperatorCardProps } from './OperatorCard'
import { VectorCard } from './VectorCard'

export class Differencator extends OperatorCard implements IComputable {
  constructor({ name, card }: OperatorCardProps) {
    super({ name: 'Differencator', card })
  }

  getName() {
    return '-'
  }

  calculate(x: number, y: number): number {
    return x - y
  }
}
