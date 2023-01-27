import { IChangable, IComputable, SwitcherValue } from './arithmetic'
import { CardType } from './CardType'
import { FormulaeCardType } from './formulae'
import { OperatorCard, OperatorCardProps } from './OperatorCard'
import { VectorCard } from './VectorCard'

export class Switcher extends OperatorCard implements IComputable, IChangable<SwitcherValue> {
  private switcherValue: SwitcherValue = SwitcherValue.DIFFERENCATOR

  constructor({ name, card }: OperatorCardProps) {
    super({ name: 'Switcher', card })
  }
  getChangableState(): SwitcherValue {
    return this.switcherValue
  }

  getNextPossibleValue(): SwitcherValue {
    switch (this.getChangableState()) {
      case SwitcherValue.DENOMINATOR:
        return SwitcherValue.MULTIPLICATOR
      case SwitcherValue.MULTIPLICATOR:
        return SwitcherValue.SUMMATOR
      case SwitcherValue.SUMMATOR:
        return SwitcherValue.DIFFERENCATOR
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

  getDescription() {
    switch (this.getChangableState()) {
      case SwitcherValue.SUMMATOR:
        return 'Summator'
      case SwitcherValue.MULTIPLICATOR:
        return 'Multiplicator'
      case SwitcherValue.DIFFERENCATOR:
        return 'Differencator'
      case SwitcherValue.DENOMINATOR:
      default:
        return 'Denominator'
    }
  }

  getIsInteractive() {
    return true
  }

  calculate(x: number, y: number): number {
    return x - y
  }
}
