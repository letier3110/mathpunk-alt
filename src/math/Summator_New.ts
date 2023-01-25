import { IComputable } from './arithmetic'
import { CardType } from './CardType'
import { OperatorCard } from './OperatorCard'
import { VectorCard } from './VectorCard'

export class SummatorNew extends OperatorCard implements IComputable {
  constructor(card: CardType | VectorCard) {
    super({ name: 'Summator', card })
  }

  getName() {
    return '+'
  }

  calculate(x: number, y: number): number {
    return x + y
  }
}
