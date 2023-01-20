import { FC, ReactNode } from 'react'

interface CubeProps {
  children: ReactNode
}

export const Cube: FC<CubeProps> = ({ children }) => {
  return (
    <>
      {/* <div className="leftSide"></div> */}
      {/* <div className='rightSide'></div> */}
      <div className='bottomSide'></div>
      <div className='root'>{children}</div>
    </>
  )
}
