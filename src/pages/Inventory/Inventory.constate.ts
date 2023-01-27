import constate from 'constate'
import { useState } from 'react'
import { useGameModeContext } from '../../hooks/GameState.constate'
import { ArithmeticCardTypeEnum, ArithmeticCardTypes } from '../../math/arithmetic'
import { CardType } from '../../math/CardType'
import { GAME_MODES } from '../../math/math'
import { NavigatorCard } from '../../math/NavigatorCard'
import { OperatorCard } from '../../math/OperatorCard'
import { NAVIGATION_POWER_NAME, REROLL_POWER_NAME } from '../../shared/decks.data'
import { getItem, setItem } from '../../storage'
import {
  getMathOperatorsItem,
  getPowersItem,
  MATH_OPERATORS_STORAGE_KEY,
  setMathOperatorsItem,
  setPowersItem
} from './Inventory.storage'

// const INITIAL_MATH_OPERATORS: ArithmeticCardTypeEnum[] = []
const INITIAL_MATH_OPERATORS: ArithmeticCardTypeEnum[] = [
  ArithmeticCardTypes.DENOMINATOR,
  ArithmeticCardTypes.DIFFERENCATOR,
  ArithmeticCardTypes.MULTIPLICATOR,
  ArithmeticCardTypes.SUMMATOR,
  ArithmeticCardTypes.SWITCHER
]

type setMathOperatorsDescriptor = (operators: Array<ArithmeticCardTypeEnum>) => void
type addMathOperatorsDescriptor = (operator: ArithmeticCardTypeEnum) => void

type setPowerDescriptor = (operators: Array<OperatorCard>) => void
type addPowerDescriptor = (operator: OperatorCard) => void

type loadSaveDescriptior = () => void

interface InventoryValues {
  mathOperators: Array<ArithmeticCardTypeEnum>
  powers: Array<OperatorCard>
  loadSave: loadSaveDescriptior
  setMathOperators: setMathOperatorsDescriptor
  addMathOperator: addMathOperatorsDescriptor
  setPower: setPowerDescriptor
  addPower: addPowerDescriptor
}

// const initialPowers: Array<CardType> = []
const initialPowers: Array<OperatorCard> = [
  new NavigatorCard({ name: NAVIGATION_POWER_NAME, card: new CardType({ name: '' }) }),
  new NavigatorCard({ name: REROLL_POWER_NAME, card: new CardType({ name: '' }) })
]

export const [InventoryProvider, useInventoryContext] = constate((): InventoryValues => {
  const { setGameMode } = useGameModeContext()
  const [mathOperators, sOperators] = useState(INITIAL_MATH_OPERATORS)
  const [powers, setPowers] = useState<Array<OperatorCard>>(initialPowers)

  const setMathOperators: setMathOperatorsDescriptor = (operators: ArithmeticCardTypeEnum[]) => {
    sOperators(operators)
    setMathOperatorsItem(operators)
  }

  const addMathOperator: addMathOperatorsDescriptor = (operator: ArithmeticCardTypeEnum) => {
    sOperators((prev) => {
      const operators = prev.filter((x) => x !== operator).concat(operator)
      setMathOperatorsItem(operators)
      return operators
    })
  }

  const setPower: setPowerDescriptor = (newPowers: OperatorCard[]) => {
    setPowersItem(newPowers)
    setPowers(newPowers)
  }

  const addPower: addPowerDescriptor = (newPower: OperatorCard) => {
    setPowers((prev) => {
      const newData = prev.filter((x) => x !== newPower).concat(newPower)
      setPowersItem(newData)
      return newData
    })
  }

  const loadSave = () => {
    setPowers(getPowersItem())
    setMathOperators(getMathOperatorsItem())
    setGameMode(GAME_MODES.MAIN_MENU)
  }

  return {
    powers,
    mathOperators,
    loadSave,
    setMathOperators,
    addMathOperator,
    setPower,
    addPower
  }
})
