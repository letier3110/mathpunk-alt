import { CardType } from './CardType'

export class Unknownator extends CardType {
  constructor() {
    super({ name: 'Unknownator' })
  }

  getName() {
    return '?'
  }
}
