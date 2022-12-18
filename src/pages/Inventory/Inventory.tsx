import { FC } from 'react'
import { AdditionView } from '../../components/AdditionView/AdditionView'
import { ArithmeticCardTypeEnum, ArithmeticCardTypes } from '../../math/arithmetic'
import { ArithmeticCardTypeEnumToClass } from '../../math/math'
import { Numberator } from '../../math/Numberator'

import { useInventoryContext } from './Inventory.constate'

import s from './Inventory.module.css'

interface InventoryProps {
  //
}

const arithmeticOperators = Object.values(ArithmeticCardTypes);
const ALL_OPERATORS = arithmeticOperators.map((x) => new ArithmeticCardTypeEnumToClass[x]({ name: '' }))

export const Inventory: FC<InventoryProps> = () => {
  const { mathOperators } = useInventoryContext()
  return (
    <div className='secondPage'>
      <div className='hps mt32'>Inventory</div>
      <div className={s.sections}>
        <div className={s.section}>
          <div>Powers</div>
          <div className={s.operatorsGrid}>
            <div className='cardPlace'>
              ?
            </div>
            <div className='cardPlace'>
              ?
            </div>
            <div className='cardPlace'>
              ?
            </div>
            <div className='cardPlace'>
              ?
            </div>
            <div className='cardPlace'>
              ?
            </div>
          </div>
        </div>
        <div className={[s.section, s.operatorsSection].join(' ')}>
          <div>Math Operators</div>
          <div className={s.operatorsGrid}>
            {ALL_OPERATORS.map((x, i) => {
              const isInList = mathOperators.indexOf(arithmeticOperators[i])
              return (
                <AdditionView
                  key={x.getId()}
                  className={s.addition}
                  card={isInList >= 0 ? x : new Numberator()}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
