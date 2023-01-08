import { IComputable } from './arithmetic'
import { CardType } from './CardType'

export class Attacher extends CardType implements IComputable {
  constructor(count?: number) {
    super({ name: 'Attacher' })
    if(count) {
      this.setCount(count)
    }
  }

  getName() {
    return this.getCount();
  }

  calculate(x: number, y: number): number {
    return x - y
  }
}
