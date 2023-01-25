import { CSSProperties, FC, ReactNode } from 'react'
import { findMax, IColor } from '../../math/ColorType'
import { VectorCard } from '../../math/VectorCard'

// export const ColorSquareStates = {
//   hidden: 'hidden',
//   opening: 'opening',
//   visible: 'visible',
//   closing: 'closing'
// }

// export type TCubeState = keyof typeof CubeStates

export const vectorCardToColor = (a: VectorCard): IColor => {
  if (a.getSize() !== 3)
    return {
      red: 0,
      green: 0,
      blue: 0
    }
  const values = a.getCount()
  return {
    red: values[0],
    green: values[1],
    blue: values[2]
  }
}

interface ColorSquareProps {
  color: IColor
}

const to255 = (x: number, max: number) => (x / max) * 255

export const ColorSquare: FC<ColorSquareProps> = ({ color }) => {
  const max = findMax(color)
  const colorStyles: CSSProperties = {
    backgroundColor: `rgb(${to255(color.red, max)}, ${to255(color.green, max)}, ${to255(color.blue, max)})`
  }
  return <div style={{ ...colorStyles }} className={['colorSquare'].join(' ')}></div>
}
