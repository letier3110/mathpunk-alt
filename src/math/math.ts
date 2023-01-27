import { ArithmeticCardTypeEnum, ArithmeticCardTypes } from './arithmetic'
import { CardType } from './CardType'
import { Cosinusator } from './Cosinusator'
import { Denominator } from './Denominator'
import { Differencator } from './Differencator'
import { FNumberator } from './FNumberator'
import { FormulaeCardType, FormulaeCardTypeEnum } from './formulae'
import { Linenator } from './Linenator'
import { Multiplicator } from './Multiplicator'
import { OperatorCard } from './OperatorCard'
import { Sinusator } from './Sinusator'
import { Squarerator } from './Squarerator'
import { Summator } from './Summator'
import { Switcher } from './Switcher'

export const ArithmeticCardTypeEnumToClass: Record<ArithmeticCardTypeEnum, typeof OperatorCard> = {
  [ArithmeticCardTypes.DENOMINATOR]: Denominator,
  [ArithmeticCardTypes.SUMMATOR]: Summator,
  [ArithmeticCardTypes.MULTIPLICATOR]: Multiplicator,
  [ArithmeticCardTypes.DIFFERENCATOR]: Differencator,
  [ArithmeticCardTypes.SWITCHER]: Switcher
  // [CardTypeEnum.NUMBERATOR]: Numberator
}

export const FormulaeCardTypeEnumToClass: Record<FormulaeCardTypeEnum, typeof OperatorCard> = {
// export const FormulaeCardTypeEnumToClass: Record<FormulaeCardTypeEnum, typeof FormulaeCardType> = {
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
  MAIN_MENU = 'main menu',
  TUTORIAL = 'tutorial',
  ARITHMETICS = 'arithmetic',
  PLOTTING = 'plotting',
  DUEL_FUNCTION = 'duel function',
  DRINKS = 'drinks',
  INTRO = 'intro'
}

export interface DifficultySettings {
  minTargetValue: number
  maxTargetValue: number
  minNumenatorValue: number
  maxNumenatorValue: number
  preciseness: number
}
