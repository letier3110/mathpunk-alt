import { FC, ReactNode } from 'react'

export const CubeStates = {
  hidden: 'hidden',
  opening: 'opening',
  visible: 'visible',
  closing: 'closing'
}

export type TCubeState = keyof typeof CubeStates

interface CubeProps {
  children: ReactNode
  state?: TCubeState
}

export const Cube: FC<CubeProps> = ({ children, state = 'hidden' }) => {
  const rootClassnames =
    state === 'opening' ? 'boardShow' : state === 'closing' ? 'boardHide' : state === 'hidden' ? 'boardHidden' : ''
  const bottomClassnames =
    state === 'opening' ? 'bottomShow' : state === 'closing' ? 'bottomHide' : state === 'hidden' ? 'bottomHidden' : ''
  // const bottomClassnames = '';
  return (
    <>
      {/* <div className="leftSide"></div> */}
      {/* <div className='rightSide'></div> */}
      <div className={['bottomSide', bottomClassnames].join(' ')}></div>
      <div className={['root', rootClassnames].join(' ')}>{children}</div>
    </>
  )
}
