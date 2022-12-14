import { CardType } from './CardType'
import { FormulaeCardType } from './formulae'

export class FNumberator extends FormulaeCardType {
  constructor() {
    super({ name: 'FNumberator', addition: new CardType({ name: '' }) })
  }

  getName() {
    return this.getCount()
  }
}
