import { ArithmeticCardTypeEnum, ArithmeticCardTypes } from '../../math/arithmetic'
import { CardType } from '../../math/CardType'
import { FNumberator } from '../../math/FNumberator'
import { FormulaeCardType, FormulaeCardTypeEnum } from '../../math/formulae'
import { ArithmeticCardTypeEnumToClass, DIFFICULTIES, FormulaeCardTypeEnumToClass } from '../../math/math'
import { Switcher } from '../../math/Switcher'
import { weightedRand } from '../../math/utils'
import { VALUES_PLOTTING } from './Plottings.data'

const getStartCardPool = (operators: Array<ArithmeticCardTypeEnum>): Record<ArithmeticCardTypeEnum, number> => {
  const baseOperators = {
    [ArithmeticCardTypes.DENOMINATOR]: 0,
    [ArithmeticCardTypes.SUMMATOR]: 0,
    [ArithmeticCardTypes.MULTIPLICATOR]: 0,
    [ArithmeticCardTypes.DIFFERENCATOR]: 0,
    [ArithmeticCardTypes.SWITCHER]: 0
    // [CardTypeEnum.NUMBERATOR]: 3,
  }
  return operators.reduce((p, c) => ({ ...p, [c]: 1 }), baseOperators)
}

const PlottingStartCardPool: Record<FormulaeCardTypeEnum, number> = {
  [FormulaeCardTypeEnum.LINENATOR]: 1,
  [FormulaeCardTypeEnum.SQUARERATOR]: 1,
  [FormulaeCardTypeEnum.SINUSATOR]: 1,
  [FormulaeCardTypeEnum.COSINUSATOR]: 1,
  [FormulaeCardTypeEnum.F_NUMBERATOR]: 1
}

// const PlottingStartCardAdditionsPool: Record<ArithmeticCardTypeEnum, number> = {
//   [ArithmeticCardTypes.DENOMINATOR]: 1,
//   [ArithmeticCardTypes.SUMMATOR]: 1,
//   [ArithmeticCardTypes.MULTIPLICATOR]: 1,
//   [ArithmeticCardTypes.DIFFERENCATOR]: 1,
//   [ArithmeticCardTypes.SWITCHER]: 0
// }

let latestTarget = 0

export const generateTargetPlotting = (hardMode = false): string => {
  // const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY
  // const min = VALUES[mode].minTargetValue
  // const max = VALUES[mode].maxTargetValue
  // latestTarget = Math.floor(Math.random() * (max - min) + min)
  const deck = getDeckPoolPlotting({
    poolSize: 3,
    operators: [
      ArithmeticCardTypes.DENOMINATOR,
      ArithmeticCardTypes.DIFFERENCATOR,
      ArithmeticCardTypes.MULTIPLICATOR,
      ArithmeticCardTypes.SUMMATOR,
      ArithmeticCardTypes.SWITCHER
    ]
  })
  const strResult = deck.reduce(
    (a, p, i) => a.concat(p.getName().toString(), i === deck.length - 1 ? '' : p.getAddition().getName()),
    ''
  )
  // const strResult = '-2x + sin(x)'
  return strResult
}

const generateNumenator = (hardMode = false): number => {
  const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY
  const min = VALUES_PLOTTING[mode].minNumenatorValue
  const max = VALUES_PLOTTING[mode].maxNumenatorValue
  let res = Math.floor(Math.random() * (max - min) + min)
  while (res === latestTarget) {
    res = Math.floor(Math.random() * (max - min) + min)
  }
  return res
}

interface GetDeckPoolProps {
  hardMode?: boolean
  poolSize?: number
  operators: Array<ArithmeticCardTypeEnum>
}

export const getDeckPoolPlotting = (props: GetDeckPoolProps): FormulaeCardType[] => {
  const { hardMode = false, poolSize = 5, operators = [] } = props
  if (operators.length === 0) return []
  const array = Array(poolSize).fill((x: number) => x)
  const res = array.map((): FormulaeCardType => {
    const functionalClassEnum = weightedRand<FormulaeCardTypeEnum>(PlottingStartCardPool)
    const functionalClass = functionalClassEnum()
    const result = new FormulaeCardTypeEnumToClass[functionalClass]({
      name: '',
      addition: new CardType({ name: '' })
    })
    // result.setCount(generateNumenator(hardMode))
    if (result instanceof FNumberator) {
      result.setCount(generateNumenator(hardMode))

      const additionClass = new Switcher()
      // additionClass.setChangableState(generateNumenator(hardMode))
      // additionClass.setCount(generateNumenator(hardMode))
      result.setAddition(additionClass)
      return result
    } else {
      const additionalClass = weightedRand<ArithmeticCardTypeEnum>(getStartCardPool(operators))()
      result.setAddition(new ArithmeticCardTypeEnumToClass[additionalClass]({ name: '' }))
      return result
    }
  })
  return res
}
