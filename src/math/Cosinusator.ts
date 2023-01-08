import { CardType } from './CardType'
import { FormulaeCardType } from './formulae'

export class Cosinusator extends FormulaeCardType {
  constructor() {
    super({ name: 'Cosinusator', addition: new CardType({ name: '' }) })
  }

  getName() {
    return 'cos(x)'
  }
}
