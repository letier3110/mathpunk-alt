import { CardType } from './arithmetic'
import { FormulaeCardType } from './formulae'

export class Linenator extends FormulaeCardType {
  constructor() {
    super({ name: 'Linenator', addition: new CardType({ name: '' }) })
  }

  getName() {
    return '(x)'
  }
}
