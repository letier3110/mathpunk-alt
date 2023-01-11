import { CardType } from './CardType'

export class Reroller extends CardType {
  constructor(name = 'Reroller') {
    super({ name })
  }

  getName() {
    return this.getCount();
  }

  getDescription() {
    return `reroll?\n${this.getCount()}`;
  }
}
