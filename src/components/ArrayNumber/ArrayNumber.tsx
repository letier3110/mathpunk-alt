import { FC } from 'react'
import { VectorCard } from '../../math/VectorCard'

interface ArrayNumberProps {
  item: VectorCard;
}

export const ArrayNumber: FC<ArrayNumberProps> = ({ item }) => {
  // const max = findMax(color)
  // const colorStyles: CSSProperties = {
  //   backgroundColor: `rgb(${to255(color.red, max)}, ${to255(color.green, max)}, ${to255(color.blue, max)})`
  // }
  const count = item.getCount().join(', ')
  return (<div className={['arrayNumber'].join(' ')}>
    [{count}]
  </div>)
}
