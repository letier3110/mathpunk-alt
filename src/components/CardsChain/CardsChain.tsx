import { FC, ReactNode } from 'react'
import { CardType } from '../../math/CardType'
import { VectorCard } from '../../math/VectorCard'

interface CardsChainProps {
  chain: Array<CardType | VectorCard>
  children: ReactNode[]
  keys?: string[]
  className?: string
  equalizerResult: string | ReactNode
  handleEqual: () => void
}

export const CardsChain: FC<CardsChainProps> = ({ chain, children, keys, equalizerResult, className, handleEqual }) => {
  if (chain.length === 0) return null
  return (
    <div className={['chain', className].join(' ')}>
      {children.map((x, index) => (
        <div key={(keys ?? [(index = index)])[index]} className='chainElem'>
          {x}
        </div>
      ))}
      {chain.length > 0 && (
        <div className='chainResultElem'>
          <div className={['cardAddition', 'equalizer'].join(' ')}>
            <div className='additionText'>=</div>
          </div>
          <div onClick={handleEqual} className='card'>
            {typeof equalizerResult === 'string' ? <div className='mainText'>{equalizerResult}</div> : equalizerResult}
          </div>
        </div>
      )}
    </div>
  )
}
