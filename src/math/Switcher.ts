import { CardType, IChangable, IComputable } from "./arithmetic"

enum SwitcherValue {
  DENOMINATOR,
  MULTIPLICATOR,
  SUMMATOR,
  DIFFERENCATOR
}

export class Switcher extends CardType implements IComputable, IChangable<SwitcherValue> {
  private switcherValue: SwitcherValue = SwitcherValue.DIFFERENCATOR

  constructor() {
    super({ name: 'Switcher' })
  }
  getChangableState(): SwitcherValue {
    return this.switcherValue
  }
  setChangableState(value: SwitcherValue): void {
    this.switcherValue = value
  }

  getName() {
    return '-'
  }

  calculate(x: number, y: number): number {
    return x - y
  }
}
