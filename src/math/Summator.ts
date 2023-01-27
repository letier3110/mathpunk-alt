import { IComputable } from './arithmetic'
import { CardType } from './CardType'
import { FormulaeCardType } from './formulae'
import { OperatorCard, OperatorCardProps } from './OperatorCard'
import { VectorCard } from './VectorCard'

export class Summator extends OperatorCard implements IComputable {
  constructor({ name, card }: OperatorCardProps) {
    const newName = 'Summator'
    super({ name: newName, card })
    card.setName(newName)
    this.setCard(card)
  }

  getName() {
    return '+'
  }

  calculate(x: number, y: number): number {
    return x + y
  }
}

// export class Summator extends CardType implements IComputable {
//   constructor() {
//     super({ name: 'Summator' })
//   }

//   getName() {
//     return '+'
//   }

//   calculate(x: number, y: number): number {
//     return x + y
//   }
// }

