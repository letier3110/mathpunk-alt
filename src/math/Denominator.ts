import { IComputable } from "./arithmetic"
import { CardType } from './CardType'
import { FormulaeCardType } from "./formulae"
import { OperatorCard, OperatorCardProps } from "./OperatorCard"
import { VectorCard } from "./VectorCard"

export class Denominator extends OperatorCard implements IComputable {
  constructor({ name, card }: OperatorCardProps) {
    super({ name: 'Denominator', card })
  }

  getName() {
    return '/'
  }

  calculate(x: number, y: number): number {
    return x / y
  }
}
