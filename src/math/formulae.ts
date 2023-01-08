import { CardType } from './CardType'

export enum FormulaeCardTypeEnum {
  LINENATOR = 'LINENATOR',
  SQUARERATOR = 'SQUARERATOR',
  SINUSATOR = 'SINUSATOR',
  COSINUSATOR = 'COSINUSATOR',
  F_NUMBERATOR = 'F_NUMBERATOR'
}

interface FormulaeCardTypeProps {
  addition: CardType
  name: string
}

export class FormulaeCardType extends CardType {
  private addition: CardType
  constructor({ addition, name }: FormulaeCardTypeProps) {
    super({ name })
    this.addition = addition
  }

  setAddition(addition: CardType) {
    this.addition = addition
  }

  getAddition() {
    return this.addition
  }
}
