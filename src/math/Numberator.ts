import { CardType, IComputable } from './arithmetic'

export class Numberator extends CardType implements IComputable {
  constructor() {
    super({ name: 'Numberator' })
  }

  getName() {
    return this.getCount();
  }

  calculate(x: number, y: number): number {
    return x - y
  }
}
