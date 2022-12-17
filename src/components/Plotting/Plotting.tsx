import { FC, useMemo, useState } from 'react'
import { parse } from 'mathjs'

import {
  GAME_MODES
} from '../../math/math'

import { Reroll } from '../../Reroll'
import { FormulaeCardType } from '../../math/formulae'
import { formatNumber } from '../../math/utils'
import { FunctionalTypeView } from '../FunctionalTypeView/FunctionalTypeView'
import { X_SIZE, Y_SIZE } from './Plottings.data'
import { useGraph } from './useGraph.hook'
import { generateTargetPlotting, getDeckPoolPlotting } from './Plotting.utils'

interface PlottingProps {
  gameMode: GAME_MODES
  setGameMode: (x: GAME_MODES) => void
}

interface AddCardProps {
  card: FormulaeCardType
  index?: number
}

export const Plotting: FC<PlottingProps> = ({ gameMode, setGameMode }) => {
  const [hardMode, setHardMode] = useState<boolean>(false)
  const [count, setCount] = useState(generateTargetPlotting())
  const [tutorialMode, setTutorialMode] = useState<boolean>(false)
  const [left, setLeft] = useState(3)
  const [enemyHp, setEnemyHp] = useState(10)
  // const [round, setRound] = useState<number>(1)
  const [chain, setChain] = useState<FormulaeCardType[]>([])
  const [deck, setDeck] = useState<FormulaeCardType[]>(getDeckPoolPlotting({}))

  const equalizerResult: string = useMemo(() => {
    // console.log('return 0', 0)
    if (chain.length === 0) return '0'
    // console.log('chain[0].getCount()', chain[0].getName())
    if (chain.length === 1) return chain[0].getName()
    const strResult = chain.reduce(
      (a, p, i) => a.concat(p.getName().toString(), i === chain.length - 1 ? '' : p.getAddition().getName()),
      ''
    )
    // console.log('strResult', strResult)
    return strResult
  }, [chain])

  const isGameEnded = enemyHp <= 0

  const {
    prediction,
    targetPlotStr,
    targetLowerPlotStr,
    targetLowerToUpperConnectionStr,
    targetUpperPlotStr,
    targetUpperLowerEndStr,
    playerPlotStr,
    graphConsts,
    setPrediction
  } = useGraph({
    chainLength: chain.length,
    count,
    equalizerResult,
    hardMode
  })

  // console.log('equalizerResult', equalizerResult)

  const mathTargetNode = parse(count)
  const targetEvalFunction = mathTargetNode.compile()
  const mathPlayerNode = parse(equalizerResult)
  const playerEvalFunction = mathPlayerNode.compile()

  const handleAddCard = ({ card, index }: AddCardProps) => {
    if (!index) {
      const newArr = chain.concat(card)
      setChain(newArr)
      setDeck(deck.filter((x) => x.getId() !== card.getId()))
    } else {
      const newArr = [...chain.slice(0, index), card, ...chain.slice(index)]
      setChain(newArr)
      setDeck(deck.filter((x) => x.getId() !== card.getId()))
    }
  }

  const handleRemoveCard = ({ card, index }: AddCardProps) => {
    if (!index) {
      const newArr = deck.concat(card)
      setDeck(newArr)
      setChain(chain.filter((x) => x.getId() !== card.getId()))
    } else {
      const newArr = [...deck.slice(0, index), card, ...deck.slice(index)]
      setDeck(newArr)
      setChain(chain.filter((x) => x.getId() !== card.getId()))
    }
  }

  const handleStartNewRound = () => {
    setPrediction(0)
    setCount(generateTargetPlotting())
    // setRound(round + 1)
    setChain([])
    setLeft(3)
    setDeck(getDeckPoolPlotting({ hardMode }))
  }

  const handleStartNewGame = () => {
    setPrediction(0)
    setCount(generateTargetPlotting())
    // setRound(1)
    setChain([])
    setDeck(getDeckPoolPlotting({ hardMode }))
    setEnemyHp(10)
    setLeft(3)
  }

  const handleReroll = () => {
    if (left > 0) {
      setLeft(left - 1)
      setDeck(getDeckPoolPlotting({ hardMode }))
    }
  }

  const handleEqual = () => {
    setEnemyHp(enemyHp + prediction)
    handleStartNewRound()
  }

  return (
    <>
      <div className='backHeader'>
        <div className='card' onClick={() => setGameMode(GAME_MODES.ARITHMETICS)}>
          Prev gamemode?
        </div>
      </div>
      <div className='root'>
        <div className='hps'>
          <div>
            Remaining points to beat:
            {formatNumber(enemyHp)}
            {prediction !== 0 && chain.length > 0 && (
              <span style={{ color: prediction > 0 ? '#ff0000' : '#00aa00' }}>
                {' '}
                {prediction !== 0 ? `(${prediction > 0 ? '+' : ''}${prediction})` : ''}
              </span>
            )}
          </div>
        </div>
        {isGameEnded === false && (
          <>
            <div className='plot'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox={`0 0 ${X_SIZE} ${Y_SIZE}`}
                stroke='currentColor'
                strokeWidth={1}
              >
                <path
                  strokeLinecap='round'
                  strokeWidth={1}
                  strokeOpacity={0.5}
                  strokeLinejoin='round'
                  d={graphConsts.join(' ')}
                />
                <path strokeLinecap='round' stroke='#00aa00' opacity={0.5} strokeLinejoin='round' d={targetPlotStr} />
                <path
                  stroke='transparent'
                  fill='#00ff00'
                  opacity={0.3}
                  d={targetLowerPlotStr + targetLowerToUpperConnectionStr + targetUpperPlotStr + targetUpperLowerEndStr}
                />
                {chain.length > 0 && (
                  <path stroke='#0000ff' strokeLinecap='round' strokeLinejoin='round' d={playerPlotStr} />
                )}
              </svg>
            </div>
            {chain.length > 0 && (
              <div className='chain'>
                {chain.map((x) => {
                  return (
                    <div key={x.getId()} className='chainElem'>
                      <div onClick={() => handleRemoveCard({ card: x })} className='card noAddition'>
                        <div className='mainText'>{x.getName()}</div>
                        <div className={['addition', x.getAddition().getDescription()].join(' ')}>
                          <div className='additionText'>{x.getAddition().getName()}</div>
                        </div>
                      </div>
                      <div className={['cardAddition', x.getAddition().getDescription()].join(' ')}>
                        <div className='additionText'>{x.getAddition().getName()}</div>
                      </div>
                    </div>
                  )
                })}
                <div></div>
                {chain.length > 0 && (
                  <div className='chainResultElem'>
                    <div className={['cardAddition', 'equalizer'].join(' ')}>
                      <div className='additionText'>=</div>
                    </div>
                    <div onClick={handleEqual} className='card'>
                      <div className='mainText'>{equalizerResult}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* {tutorialMode && chain.length > 0 && (<div className='tutorialText'>CLICK ON THE CARD RESULT CARD TO APPLY IT</div>)} */}
            <div className='cards'>
              {deck.map((x, index) => {
                const translateY = Math.abs(-Math.floor(deck.length / 2) + index)
                const rotate = -Math.floor(deck.length / 2)
                const style = {
                  rotate: `${(rotate + index) * 10}deg`,
                  translate: `0px ${translateY * translateY * 12}px`
                }
                return (
                  <FunctionalTypeView
                    key={x.getId()}
                    card={x}
                    style={style}
                    handleCardClick={() => handleAddCard({ card: x })}
                  />
                )
              })}
            </div>
            {/* <div className='cards'>
              {deck.map((x, index) => {
                const translateY = Math.abs(-Math.floor(deck.length / 2) + index)
                const rotate = -Math.floor(deck.length / 2)
                const style = {
                  rotate: `${(rotate + index) * 10}deg`,
                  translate: `0px ${translateY * translateY * 12}px`
                }
                return (
                  <CardTypeView
                    key={x.getId()}
                    card={x}
                    style={style}
                    handleCardClick={() => handleAddCard({ card: x })}
                  />
                )
              })}
            </div> */}
            {/* {tutorialMode && deck.length > 0 && <div className='tutorialText'>CLICK ON THE CARD TO PLAY IT</div>} */}
          </>
        )}
        {isGameEnded === true && (
          <div className='win'>
            <div>🥳🥳🥳</div>
            <div>You won!</div>
            <div>
              Hard mode?
              <input type='checkbox' checked={hardMode} onChange={(e) => setHardMode(e.target.checked)} />
            </div>
            <div className='card' onClick={handleStartNewGame}>
              Start new game?
            </div>
          </div>
        )}
      </div>
      <Reroll left={left} handleReroll={handleReroll} />
    </>
  )
}
