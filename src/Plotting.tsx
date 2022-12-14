import { FC, useEffect, useMemo, useState } from 'react'
import { parse } from 'mathjs'

import {
  ArithmeticCardTypeEnumToClass,
  DIFFICULTIES,
  DifficultySettings,
  FormulaeCardTypeEnumToClass,
  GAME_MODES
} from './math/math'

import { Reroll } from './Reroll'
import { FormulaeCardType, FormulaeCardTypeEnum } from './math/formulae'
import { ArithmeticCardTypeEnum, CardType } from './math/arithmetic'
import { weightedRand } from './math/utils'

const StartCardPool: Record<FormulaeCardTypeEnum, number> = {
  [FormulaeCardTypeEnum.LINENATOR]: 1,
  [FormulaeCardTypeEnum.SQUARERATOR]: 1,
  [FormulaeCardTypeEnum.SINUSATOR]: 1,
  [FormulaeCardTypeEnum.COSINUSATOR]: 1
}

const StartCardAdditionsPool: Record<ArithmeticCardTypeEnum, number> = {
  [ArithmeticCardTypeEnum.DENOMINATOR]: 1,
  [ArithmeticCardTypeEnum.SUMMATOR]: 1,
  [ArithmeticCardTypeEnum.MULTIPLICATOR]: 1,
  [ArithmeticCardTypeEnum.DIFFERENCATOR]: 1,
  [ArithmeticCardTypeEnum.SWITCHER]: 0
}

const VALUES: Record<DIFFICULTIES, DifficultySettings> = {
  [DIFFICULTIES.EASY]: {
    minTargetValue: 5,
    maxTargetValue: 15,
    minNumenatorValue: 1,
    maxNumenatorValue: 20,
    preciseness: 95
  },
  [DIFFICULTIES.HARD]: {
    minTargetValue: 2000,
    maxTargetValue: 8000,
    minNumenatorValue: 100,
    maxNumenatorValue: 999,
    preciseness: 25
  }
}

let latestTarget = 0

const generateTarget = (hardMode = false): string => {
  // const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY
  // const min = VALUES[mode].minTargetValue
  // const max = VALUES[mode].maxTargetValue
  // latestTarget = Math.floor(Math.random() * (max - min) + min)
  return '-2x + sin(x)'
}

const generateNumenator = (hardMode = false): number => {
  const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY
  const min = VALUES[mode].minNumenatorValue
  const max = VALUES[mode].maxNumenatorValue
  let res = Math.floor(Math.random() * (max - min) + min)
  while (res === latestTarget) {
    res = Math.floor(Math.random() * (max - min) + min)
  }
  return res
}

interface AddCardProps {
  card: FormulaeCardType
  index?: number
}

const getDeckPool = (hardMode = false): FormulaeCardType[] => {
  const array = Array(5).fill((x: number) => x)
  const res = array.map((): FormulaeCardType => {
    const result = new FormulaeCardTypeEnumToClass[weightedRand<FormulaeCardTypeEnum>(StartCardPool)()]({
      name: '',
      addition: new CardType({ name: '' })
    })
    // result.setCount(generateNumenator(hardMode))
    result.setAddition(
      new ArithmeticCardTypeEnumToClass[weightedRand<ArithmeticCardTypeEnum>(StartCardAdditionsPool)()]({ name: '' })
    )
    return result
  })
  return res
}

interface PlottingProps {
  gameMode: GAME_MODES
  setGameMode: (x: GAME_MODES) => void
}

const Y_SIZE = 400
const Y_SCALE = 10
const X_SIZE = 400
const X_SCALE = 10

export const Plotting: FC<PlottingProps> = ({ gameMode, setGameMode }) => {
  const [hardMode, setHardMode] = useState<boolean>(false)
  const [count, setCount] = useState(generateTarget())
  const [tutorialMode, setTutorialMode] = useState<boolean>(false)
  const [left, setLeft] = useState(3)
  const [enemyHp, setEnemyHp] = useState(10)
  // const [round, setRound] = useState<number>(1)
  const [chain, setChain] = useState<FormulaeCardType[]>([])
  const [deck, setDeck] = useState<FormulaeCardType[]>(getDeckPool())
  const [prediction, setPrediction] = useState(0)

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
  const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY
  const preciseness = VALUES[mode].preciseness

  // console.log('equalizerResult', equalizerResult)

  const mathTargetNode = parse(count)
  const targetEvalFunction = mathTargetNode.compile()
  const mathPlayerNode = parse(equalizerResult)
  const playerEvalFunction = mathPlayerNode.compile()
  // let scope = {
  //   x: 3,
  // }
  // code2.evaluate(scope)

  useEffect(() => {
    // if (equalizerResult === count) {
    //   setPrediction(-5)
    // }
    if (chain.length === 0) return
    const checkPointsCount = 5
    // console.log(playerEvalFunction, targetEvalFunction)
    const playerResult = Array(checkPointsCount)
      .fill(1)
      .map((x, i) => i * (X_SIZE / checkPointsCount))
      .map((x) => {
        const scope = {
          x
        }
        return playerEvalFunction.evaluate(scope)
      })
    const targetResult = Array(checkPointsCount)
      .fill(1)
      .map((x, i) => i * (X_SIZE / checkPointsCount))
      .map((x) => {
        const scope = {
          x
        }
        return targetEvalFunction.evaluate(scope)
      })
    const localPreciseness = preciseness / 100
    let summ = 0
    for (let i = 0; i < checkPointsCount; i++) {
      console.log('summ i', summ, i, playerResult[i], targetResult[i])
      if (
        playerResult[i] > targetResult[i] * (1 - localPreciseness) &&
        playerResult[i] < targetResult[i] * (1 + localPreciseness)
      ) {
        console.log('res')
        const res = Math.round((1 - Math.abs((playerResult[i] - targetResult[i]) / targetResult[i])) * 5)
        summ -= res
      } else {
        summ += 5
      }
    }
    setPrediction(summ / checkPointsCount)
  }, [equalizerResult, count, mode, preciseness, playerEvalFunction, targetEvalFunction, setPrediction])

  const targetDots = Array(X_SIZE)
    .fill(1)
    .map((x, i) => i - X_SIZE / 2)
    .map((x) => {
      const scope = {
        x: x / X_SCALE
      }
      return `L${x + X_SIZE / 2} ${Y_SIZE / 2 - targetEvalFunction.evaluate(scope) * Y_SCALE}`
    })

  const playerDots = Array(X_SIZE)
    .fill(1)
    .map((x, i) => i - X_SIZE / 2)
    .map((x) => {
      const scope = {
        x: x / X_SCALE
      }
      return `L${x + X_SIZE / 2} ${Y_SIZE / 2 - playerEvalFunction.evaluate(scope) * Y_SCALE}`
    })

  const targetPlotStr = [`M${targetDots[0].substring(1)}`, ...targetDots].join(' ')
  const playerPlotStr = [`M${playerDots[0].substring(1)}`, ...playerDots].join(' ')

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
    setCount(generateTarget())
    // setRound(round + 1)
    setChain([])
    setLeft(3)
    setDeck(getDeckPool(hardMode))
  }

  const handleStartNewGame = () => {
    setPrediction(0)
    setCount(generateTarget())
    // setRound(1)
    setChain([])
    setDeck(getDeckPool(hardMode))
    setEnemyHp(10)
    setLeft(3)
  }

  const handleReroll = () => {
    if (left > 0) {
      setLeft(left - 1)
      setDeck(getDeckPool(hardMode))
    }
  }

  const handleEqual = () => {
    setEnemyHp(enemyHp + prediction)
    handleStartNewRound()
  }

  const graphConsts = [`M${X_SIZE / 2} 0`, `L${X_SIZE / 2} ${Y_SIZE}`, `M0 ${Y_SIZE / 2}`, `L${X_SIZE} ${Y_SIZE / 2}`]

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
            {enemyHp}
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
                <path strokeLinecap='round' strokeLinejoin='round' d={targetPlotStr} />
                {chain.length > 0 && (
                  <path stroke='#ff0000' strokeLinecap='round' strokeLinejoin='round' d={playerPlotStr} />
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
                return (
                  <div
                    key={x.getId()}
                    className='card'
                    style={{
                      rotate: `${(rotate + index) * 10}deg`,
                      translate: `0px ${translateY * translateY * 12}px`
                    }}
                    onClick={() => handleAddCard({ card: x })}
                  >
                    <div className='mainText'>{x.getName()}</div>
                    <div className={['addition', x.getAddition().getDescription()].join(' ')}>
                      <div className='additionText'>{x.getAddition().getName()}</div>
                    </div>
                  </div>
                )
              })}
            </div>
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
