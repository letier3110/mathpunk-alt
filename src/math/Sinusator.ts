import { CardType } from './arithmetic'
import { FormulaeCardType } from './formulae'

export class Sinusator extends FormulaeCardType {
  constructor() {
    super({ name: 'Sinusator', addition: new CardType({ name: '' }) })
  }

  getName() {
    return 'sin(x)'
  }
}
