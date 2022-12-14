import constate from "constate";
import { useState } from "react";
import { ArithmeticCardTypeEnum } from "../../math/arithmetic";

const INITIAL_MATH_OPERATORS: ArithmeticCardTypeEnum[] = []

type setMathOperatorsDescriptor = (operators: ArithmeticCardTypeEnum[]) => void
type addMathOperatorsDescriptor = (operator: ArithmeticCardTypeEnum) => void

interface InventoryValues {
  mathOperators: ArithmeticCardTypeEnum[]
  setMathOperators: setMathOperatorsDescriptor
  addMathOperator: addMathOperatorsDescriptor
}

// 2️⃣ Wrap your hook with the constate factory
export const [InventoryProvider, useInventoryContext] = constate((): InventoryValues => {
  const [mathOperators, sOperators] = useState(INITIAL_MATH_OPERATORS)

  const setMathOperators: setMathOperatorsDescriptor = (operators: ArithmeticCardTypeEnum[]) => {
    sOperators(operators)
  }

  const addMathOperator: addMathOperatorsDescriptor = (operator: ArithmeticCardTypeEnum) => {
    sOperators((prev) => prev.filter(x => x !== operator).concat(operator))
  }

  return { 
    mathOperators,
    setMathOperators,
    addMathOperator
   };
});