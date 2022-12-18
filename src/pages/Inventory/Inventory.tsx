import { FC } from 'react'
import { ArithmeticCardTypeEnum, ArithmeticCardTypes } from '../../math/arithmetic'

import { useInventoryContext } from './Inventory.constate'

import s from './Inventory.module.css'

interface InventoryProps {
  //
}

const ALL_OPERATORS = []

export const Inventory: FC<InventoryProps> = () => {
  const { mathOperators } = useInventoryContext()
  return (
    <div className='secondPage'>
      <div className='hps mt32'>Inventory</div>
      <div className={s.sections}>
        <div className={s.section}>
          <div>1</div>
        </div>
        <div className={s.section}>
          <div>2</div>
        </div>
        <div className={[s.section, s.operatorsSection].join(' ')}>
          <div>Math Operators</div>
          <div className={s.operatorsGrid}>
            {/* {ALL_OPERATORS} */}
          </div>
        </div>
      </div>
    </div>
  )
}
