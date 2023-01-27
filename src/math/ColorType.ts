export interface IColor {
  red: number
  green: number
  blue: number
}

export const isColorEqual = (a: IColor, b: IColor): boolean => {
  return a.red === b.red && a.green === b.green && a.blue === b.blue
}

/**
 * 
 * @param a first color
 * @param b second color
 * @param _likelihoodRatio percentage of likelihood, 1 == 1%, by default = 1
 * @returns sum of: 1 for each similar field and -1 for each not similar field
 */
export const compareColors = (a: IColor, b: IColor, _likelihoodRatio?: number): number => {
  const likelihoodRatio = _likelihoodRatio ?? 1
  const maxA = findMax(a)
  const maxB = findMax(b)
  // const maxNorm = maxA > maxB ? maxA : maxB;
  const result = Object.keys(a).reduce<number>((p: number, x: string) => {
    if (x !== 'red' && x !== 'green' && x !== 'blue') return p
    const compareResult = Math.abs((a[x] / maxA) - (b[x] / maxB)) * 100 > likelihoodRatio ? -1 : 1
    return p + compareResult
  }, 0)
  return result
}

export const findMax = (a: IColor): number => {
  return a.red > a.blue && a.red > a.green ? a.red : a.blue > a.red && a.blue > a.green ? a.blue : a.green
}

export const summColors = (a: IColor, b:IColor): IColor => {
  return {
    red: a.red + b.red,
    green: a.green + b.green,
    blue: a.blue + b.blue
  }
}