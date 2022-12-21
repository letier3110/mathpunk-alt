import { CardType } from './arithmetic'

export class Unknownator extends CardType {
  constructor() {
    super({ name: 'Unknownator' })
  }

  getName() {
    return '?'
  }
}
