import { CardType, IChangable, IComputable, SwitcherValue } from './arithmetic'

export class Switcher extends CardType implements IComputable, IChangable<SwitcherValue> {
  private switcherValue: SwitcherValue = SwitcherValue.DIFFERENCATOR

  constructor() {
    super({ name: 'Switcher' })
  }
  getChangableState(): SwitcherValue {
    return this.switcherValue
  }

  getNextPossibleValue(): SwitcherValue {
    switch (this.getChangableState()) {
      case SwitcherValue.DENOMINATOR:
        return SwitcherValue.MULTIPLICATOR;
      case SwitcherValue.MULTIPLICATOR:
        return SwitcherValue.SUMMATOR;
      case SwitcherValue.SUMMATOR:
        return SwitcherValue.DIFFERENCATOR;
      case SwitcherValue.DIFFERENCATOR:
      default:
        return SwitcherValue.DENOMINATOR
    }
  }

  setChangableState(value: SwitcherValue): void {
    this.switcherValue = value
  }

  getName() {
    switch (this.getChangableState()) {
      case SwitcherValue.SUMMATOR:
        return '+'
      case SwitcherValue.MULTIPLICATOR:
        return '*'
      case SwitcherValue.DIFFERENCATOR:
        return '-'
      case SwitcherValue.DENOMINATOR:
      default:
        return '/'
    }
  }

  calculate(x: number, y: number): number {
    return x - y
  }
}
