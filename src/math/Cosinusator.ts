import { CardType } from './arithmetic'
import { FormulaeCardType } from './formulae'

export class Cosinusator extends FormulaeCardType {
  constructor() {
    super({ name: 'Cosinusator', addition: new CardType({ name: '' }) })
  }

  getName() {
    return '(cos(x))'
  }
}
