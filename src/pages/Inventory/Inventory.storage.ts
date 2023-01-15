import { ArithmeticCardTypeEnum } from "../../math/arithmetic"
import { CardType } from "../../math/CardType"
import { NavigatorCard } from "../../math/NavigatorCard"
import { getItem, setItem } from "../../storage"

export const POWERS_STORAGE_KEY = 'powers'
export const MATH_OPERATORS_STORAGE_KEY = 'mathOperators'

export const getPowersItem = (): Array<CardType> => {
  try {
    const arr: Array<{name: string}> = JSON.parse(getItem(POWERS_STORAGE_KEY) ?? '[]')
    return arr.map(x => new NavigatorCard(x.name))
  } catch (e) {
    return []
  }
}

export const setPowersItem = (payload: Array<CardType>) => {
  setItem(POWERS_STORAGE_KEY, JSON.stringify(payload))
}

export const getMathOperatorsItem = (): ArithmeticCardTypeEnum[] => {
  try {
    const arr: ArithmeticCardTypeEnum[] = JSON.parse(getItem(MATH_OPERATORS_STORAGE_KEY) ?? '[]')
    return arr
  } catch (e) {
    return []
  }
}

export const setMathOperatorsItem = (payload: ArithmeticCardTypeEnum[]) => {
  setItem(MATH_OPERATORS_STORAGE_KEY, JSON.stringify(payload))
}
