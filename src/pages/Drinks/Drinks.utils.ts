import { ArithmeticCardTypeEnum, ArithmeticCardTypes } from '../../math/arithmetic'
import { CardType } from '../../math/CardType'
import { IColor } from '../../math/ColorType'
import { ArithmeticCardTypeEnumToClass, DIFFICULTIES, DifficultySettings } from '../../math/math'
import { OperatorCard } from '../../math/OperatorCard'
import { Summator } from '../../math/Summator'
// import { Summator } from '../../math/Summator'
import { weightedRand } from '../../math/utils'
import { VectorCard } from '../../math/VectorCard'

const getStartCardPool = (operators: Array<ArithmeticCardTypeEnum>): Record<ArithmeticCardTypeEnum, number> => {
  const baseOperators = {
    [ArithmeticCardTypes.DENOMINATOR]: 1,
    [ArithmeticCardTypes.SUMMATOR]: 1,
    [ArithmeticCardTypes.MULTIPLICATOR]: 1,
    [ArithmeticCardTypes.DIFFERENCATOR]: 1,
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
let latestColorTarget: IColor = { red: 0, green: 0, blue: 0 }

const generateColorPart = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min)

export const generateTargetDrinks = (hardMode = false): IColor => {
  const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY
  const min = 0
  const max = 255
  return {
    red: generateColorPart(min, max),
    green: generateColorPart(min, max),
    blue: generateColorPart(min, max)
  }
}

export const generateNumenator = (hardMode = false): number => {
  const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY
  const min = 0
  const max = 255
  let res = Math.floor(Math.random() * (max - min) + min)
  while (res === latestTarget) {
    res = Math.floor(Math.random() * (max - min) + min)
  }
  return res
}

export const generateColor = (hardMode = false): IColor => {
  const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY
  let res: IColor = generateTargetDrinks(hardMode)
  while (res === latestColorTarget) {
    res = generateTargetDrinks(hardMode)
  }
  return res
}

export const getDeckPoolDrinks = (
  operators: Array<ArithmeticCardTypeEnum>,
  hardMode = false
): Array<OperatorCard> => {
  if (operators.length === 0) return []
  const array = Array(5).fill((x: number) => x)
  const res = array.map<OperatorCard>(() => {
    // const result = new ArithmeticCardTypeEnumToClass[
    //   weightedRand<ArithmeticCardTypeEnum>(getStartCardPool(operators))()
    // ]({
    //   name: ''
    // })
    // result.setCount(generateNumenator(hardMode))
    const card = new VectorCard({ name: '', size: 3 })
    const color = generateColor(hardMode)
    card.setCount([color.red, color.green, color.blue])
    const result = new Summator({ name: '', card})
    return result
  })
  return res
}
