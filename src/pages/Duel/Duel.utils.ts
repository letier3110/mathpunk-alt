import { ArithmeticCardTypeEnum, ArithmeticCardTypes } from "../../math/arithmetic"
import { CardType } from "../../math/CardType"
import { ArithmeticCardTypeEnumToClass, DIFFICULTIES, DifficultySettings } from "../../math/math"
import { weightedRand } from "../../math/utils"

const StartCardPool: Record<ArithmeticCardTypeEnum, number> = {
  [ArithmeticCardTypes.DENOMINATOR]: 1,
  [ArithmeticCardTypes.SUMMATOR]: 1,
  [ArithmeticCardTypes.MULTIPLICATOR]: 1,
  [ArithmeticCardTypes.DIFFERENCATOR]: 1,
  [ArithmeticCardTypes.SWITCHER]: 0
  // [CardTypeEnum.NUMBERATOR]: 3,
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

export const getDeckPoolDuel = (hardMode = false): CardType[] => {
  const array = Array(5).fill((x: number) => x)
  const res = array.map((): CardType => {
    const result = new ArithmeticCardTypeEnumToClass[weightedRand<ArithmeticCardTypeEnum>(StartCardPool)()]({
      name: ''
    })
    result.setCount(generateNumenator(hardMode))
    return result
  })
  return res
}

export const getEnemyDeckPoolArithmetic = (hardMode = false): CardType[] => {
  const array = Array(3).fill((x: number) => x)
  const res = array.map((): CardType => {
    const result = new ArithmeticCardTypeEnumToClass[weightedRand<ArithmeticCardTypeEnum>(StartCardPool)()]({
      name: ''
    })
    result.setCount(generateNumenator(hardMode))
    return result
  })
  return res
}