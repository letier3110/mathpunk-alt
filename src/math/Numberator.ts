import { IComputable } from './arithmetic'
import { CardType } from './CardType'

export class Numberator extends CardType implements IComputable {
  constructor(count?: number) {
    super({ name: 'Numberator' })
    if(count) {
      this.setCount(count)
    }
  }

  getName() {
    return this.getCount();
  }

  getDescription() {
    return this.getCount();
  }

  calculate(x: number, y: number): number {
    return x - y
  }
}
