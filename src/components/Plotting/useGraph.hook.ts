import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { parse } from 'mathjs'

import { DIFFICULTIES } from '../../math/math'
import { VALUES_PLOTTING, X_SCALE, X_SIZE, Y_SCALE, Y_SIZE } from './Plottings.data'

interface UseGraphProps {
  hardMode?: boolean
  chainLength?: number
  count: string
  equalizerResult: string
}

interface UseGraphReturnValues {
  prediction: number,
  targetPlotStr: string,
  targetLowerPlotStr: string,
  targetLowerToUpperConnectionStr: string,
  targetUpperPlotStr: string,
  targetUpperLowerEndStr: string,
  playerPlotStr: string,
  graphConsts: string[],
  setPrediction: Dispatch<SetStateAction<number>>
}

export const useGraph = ({ hardMode = false, chainLength = 0, count, equalizerResult }: UseGraphProps): UseGraphReturnValues => {
  const [prediction, setPrediction] = useState(0)
  const mode = hardMode ? DIFFICULTIES.HARD : DIFFICULTIES.EASY
  const preciseness = VALUES_PLOTTING[mode].preciseness
  const localPreciseness = preciseness / 100

  const mathTargetNode = parse(count)
  const targetEvalFunction = mathTargetNode.compile()
  const mathPlayerNode = parse(equalizerResult)
  const playerEvalFunction = mathPlayerNode.compile()

  useEffect(() => {
    if (chainLength === 0) return
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
    let summ = 0
    for (let i = 0; i < checkPointsCount; i++) {
      const lowerTarget = targetResult[i] * (1 - localPreciseness)
      const upperTarget = targetResult[i] * (1 + localPreciseness)
      // console.log('summ i', playerResult[i], lowerTarget, upperTarget)
      // const max = targetResult[i] * (1 - localPreciseness) > targetResult[i] * (1 + localPreciseness) ?
      if (Math.abs(playerResult[i]) > Math.abs(lowerTarget) && Math.abs(playerResult[i]) < Math.abs(upperTarget)) {
        // console.log('res', Math.round((1 - Math.abs((playerResult[i] - targetResult[i]) / targetResult[i])) * 5))
        const res = Math.round((1 - Math.abs((playerResult[i] - targetResult[i]) / targetResult[i])) * 5)
        summ -= res
      } else {
        summ += 5
      }
    }
    setPrediction(summ / checkPointsCount)
  }, [equalizerResult, count, mode, localPreciseness, playerEvalFunction, targetEvalFunction, setPrediction])

  const targetDots = Array(X_SIZE)
    .fill(1)
    .map((x, i) => i - X_SIZE / 2)
    .map((x) => {
      const scope = {
        x: x / X_SCALE
      }
      return `L${x + X_SIZE / 2} ${Y_SIZE / 2 - targetEvalFunction.evaluate(scope) * Y_SCALE}`
    })

  const targetLowerDots = Array(X_SIZE)
    .fill(1)
    .map((x, i) => i - X_SIZE / 2)
    .map((x) => {
      const scope = {
        x: x / X_SCALE
      }
      return `L${x + X_SIZE / 2} ${Y_SIZE / 2 - targetEvalFunction.evaluate(scope) * (1 - localPreciseness) * Y_SCALE}`
    })

  const targetUpperDots = Array(X_SIZE)
    .fill(1)
    .map((x, i) => i - X_SIZE / 2)
    .map((x) => {
      const scope = {
        x: x / X_SCALE
      }
      return `L${x + X_SIZE / 2} ${Y_SIZE / 2 - targetEvalFunction.evaluate(scope) * (1 + localPreciseness) * Y_SCALE}`
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
  const targetLowerPlotStr = [`M${targetLowerDots[0].substring(1)}`, ...targetLowerDots].join(' ')
  const targetLowerToUpperConnectionStr = ''
  const targetUpperPlotStr = targetUpperDots.reverse().join(' ')
  const targetUpperLowerEndStr = ''
  const playerPlotStr = [`M${playerDots[0].substring(1)}`, ...playerDots].join(' ')

  const graphConsts = [`M${X_SIZE / 2} 0`, `L${X_SIZE / 2} ${Y_SIZE}`, `M0 ${Y_SIZE / 2}`, `L${X_SIZE} ${Y_SIZE / 2}`]

  return {
    prediction,
    targetPlotStr,
    targetLowerPlotStr,
    targetLowerToUpperConnectionStr,
    targetUpperPlotStr,
    targetUpperLowerEndStr,
    playerPlotStr,
    graphConsts,
    setPrediction
  }
}
