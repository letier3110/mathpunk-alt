import constate from 'constate'
import { useState } from 'react'
import { ArithmeticCardTypeEnum } from '../../math/arithmetic'
import { CardType } from '../../math/CardType'

const INITIAL_MATH_OPERATORS: ArithmeticCardTypeEnum[] = []

type setMathOperatorsDescriptor = (operators: Array<ArithmeticCardTypeEnum>) => void
type addMathOperatorsDescriptor = (operator: ArithmeticCardTypeEnum) => void

type setPowerDescriptor = (operators: Array<CardType>) => void
type addPowerDescriptor = (operator: CardType) => void

interface InventoryValues {
  mathOperators: Array<ArithmeticCardTypeEnum>
  powers: Array<CardType>
  setMathOperators: setMathOperatorsDescriptor
  addMathOperator: addMathOperatorsDescriptor
  setPower: setPowerDescriptor
  addPower: addPowerDescriptor
}

const initialPowers: Array<CardType> = []

// 2️⃣ Wrap your hook with the constate factory
export const [InventoryProvider, useInventoryContext] = constate((): InventoryValues => {
  const [mathOperators, sOperators] = useState(INITIAL_MATH_OPERATORS)
  const [powers, setPowers] = useState<Array<CardType>>(initialPowers)

  const setMathOperators: setMathOperatorsDescriptor = (operators: ArithmeticCardTypeEnum[]) => {
    sOperators(operators)
  }

  const addMathOperator: addMathOperatorsDescriptor = (operator: ArithmeticCardTypeEnum) => {
    sOperators((prev) => prev.filter((x) => x !== operator).concat(operator))
  }

  const setPower: setPowerDescriptor = (newPowers: CardType[]) => {
    setPowers(newPowers)
  }

  const addPower: addPowerDescriptor = (newPower: CardType) => {
    setPowers((prev) => prev.filter((x) => x !== newPower).concat(newPower))
  }

  return {
    powers,
    mathOperators,
    setMathOperators,
    addMathOperator,
    setPower,
    addPower
  }
})
