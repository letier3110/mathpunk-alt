import { CardType } from './CardType'
import { FormulaeCardType } from './formulae'

export class Linenator extends FormulaeCardType {
  constructor() {
    super({ name: 'Linenator', addition: new CardType({ name: '' }) })
  }

  getName() {
    return 'x'
  }
}
