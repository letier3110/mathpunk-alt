import { CardType } from "./arithmetic"

export enum FormulaeCardTypeEnum {
  LINENATOR,
  SQUARERATOR,
  SINUSATOR,
  COSINUSATOR
}

interface FormulaeCardTypeProps {
  addition: CardType;
  name: string;
}

export class FormulaeCardType extends CardType {
  private addition: CardType
  constructor({ addition, name }: FormulaeCardTypeProps) {
    super({name})
    this.addition = addition;
  }

  setAddition(addition: CardType) {
    this.addition = addition;
  }

  getAddition() {
    return this.addition;
  }
}
