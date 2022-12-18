import { ArithmeticCardTypeEnum, ArithmeticCardTypes, CardType } from './arithmetic'
import { Cosinusator } from './Cosinusator'
import { Denominator } from './Denominator'
import { Differencator } from './Differencator'
import { FNumberator } from './FNumberator'
import { FormulaeCardType, FormulaeCardTypeEnum } from './formulae'
import { Linenator } from './Linenator'
import { Multiplicator } from './Multiplicator'
import { Sinusator } from './Sinusator'
import { Squarerator } from './Squarerator'
import { Summator } from './Summator'
import { Switcher } from './Switcher'

export const ArithmeticCardTypeEnumToClass: Record<ArithmeticCardTypeEnum, typeof CardType> = {
  [ArithmeticCardTypes.DENOMINATOR]: Denominator,
  [ArithmeticCardTypes.SUMMATOR]: Summator,
  [ArithmeticCardTypes.MULTIPLICATOR]: Multiplicator,
  [ArithmeticCardTypes.DIFFERENCATOR]: Differencator,
  [ArithmeticCardTypes.SWITCHER]: Switcher
  // [CardTypeEnum.NUMBERATOR]: Numberator
}

export const FormulaeCardTypeEnumToClass: Record<FormulaeCardTypeEnum, typeof FormulaeCardType> = {
  [FormulaeCardTypeEnum.LINENATOR]: Linenator,
  // [FormulaeCardTypeEnum.DOUBLE_LINENATOR]: Denominator,
  [FormulaeCardTypeEnum.SQUARERATOR]: Squarerator,
  [FormulaeCardTypeEnum.SINUSATOR]: Sinusator,
  [FormulaeCardTypeEnum.COSINUSATOR]: Cosinusator,
  [FormulaeCardTypeEnum.F_NUMBERATOR]: FNumberator
}

export enum DIFFICULTIES {
  EASY = 'easy',
  HARD = 'hard'
}

export enum GAME_MODES {
  TUTORIAL = 'tutorial',
  ARITHMETICS = 'arithmetic',
  PLOTTING = 'plotting'
}

export interface DifficultySettings {
  minTargetValue: number
  maxTargetValue: number
  minNumenatorValue: number
  maxNumenatorValue: number
  preciseness: number
}
