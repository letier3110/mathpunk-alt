import { CardType, IComputable } from './arithmetic'

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

  calculate(x: number, y: number): number {
    return x - y
  }
}
