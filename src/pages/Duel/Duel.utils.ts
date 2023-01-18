import { ArithmeticCardTypeEnum, ArithmeticCardTypes } from '../../math/arithmetic'
import { CardType } from '../../math/CardType'
import { ArithmeticCardTypeEnumToClass, DIFFICULTIES, DifficultySettings } from '../../math/math'
import { weightedRand } from '../../math/utils'

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

export const ARITHMETIC_VALUES: Record<DIFFICULTIES, DifficultySettings> = {
  [DIFFICULTIES.EASY]: {
    minTargetValue: 5,
    maxTargetValue: 15,
    minNumenatorValue: 1,
    maxNumenatorValue: 20,
    preciseness: 50
  },
  [DIFFICULTIES.HARD]: {
    minTargetValue: 2000,
    maxTargetValue: 8000,
    minNumenatorValue: 100,
    maxNumenatorValue: 999,
    preciseness: 25
  }
}

let latestTarget = 0

export const generateTargetArithmetic = (hardMode = false): number => {
  const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY
  const min = ARITHMETIC_VALUES[mode].minTargetValue
  const max = ARITHMETIC_VALUES[mode].maxTargetValue
  latestTarget = Math.floor(Math.random() * (max - min) + min)
  return latestTarget
}

export const generateNumenator = (hardMode = false): number => {
  const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY
  const min = ARITHMETIC_VALUES[mode].minNumenatorValue
  const max = ARITHMETIC_VALUES[mode].maxNumenatorValue
  let res = Math.floor(Math.random() * (max - min) + min)
  while (res === latestTarget) {
    res = Math.floor(Math.random() * (max - min) + min)
  }
  return res
}

export const getDeckPoolDuel = (operators: Array<ArithmeticCardTypeEnum>, hardMode = false): CardType[] => {
  if (operators.length === 0) return []
  const array = Array(5).fill((x: number) => x)
  const res = array.map((): CardType => {
    const result = new ArithmeticCardTypeEnumToClass[weightedRand<ArithmeticCardTypeEnum>(getStartCardPool(operators))()]({
      name: ''
    })
    result.setCount(generateNumenator(hardMode))
    return result
  })
  return res
}

export const getEnemyDeckPoolArithmetic = (hardMode = false): CardType[] => {
  const operators = [
    ArithmeticCardTypes.DENOMINATOR,
    ArithmeticCardTypes.DIFFERENCATOR,
    ArithmeticCardTypes.MULTIPLICATOR,
    ArithmeticCardTypes.SUMMATOR,
    ArithmeticCardTypes.SWITCHER
  ]
  const array = Array(3).fill((x: number) => x)
  const res = array.map((): CardType => {
    const result = new ArithmeticCardTypeEnumToClass[
      weightedRand<ArithmeticCardTypeEnum>(getStartCardPool(operators))()
    ]({
      name: ''
    })
    result.setCount(generateNumenator(hardMode))
    return result
  })
  return res
}
