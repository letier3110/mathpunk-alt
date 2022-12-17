import { CardType } from './arithmetic'
import { FormulaeCardType } from './formulae'

export class Squarerator extends FormulaeCardType {
  constructor() {
    super({ name: 'Squarerator', addition: new CardType({ name: '' }) })
  }

  getName() {
    return '(x^2)'
  }
}
