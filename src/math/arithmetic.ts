export const ArithmeticCardTypes = {
  DENOMINATOR: 'DENOMINATOR',
  SUMMATOR: 'SUMMATOR',
  MULTIPLICATOR: 'MULTIPLICATOR',
  DIFFERENCATOR: 'DIFFERENCATOR',
  SWITCHER: 'SWITCHER'
  // NUMBERATOR
} as const;

type ObjectValues<T> = T[keyof T]

export type ArithmeticCardTypeEnum = ObjectValues<typeof ArithmeticCardTypes>

export interface IComputable {
  calculate(x: number, y: number): number
}

export interface IChangable<T> {
  getChangableState(): T
  getNextPossibleValue(): T
  setChangableState(value: T): void
}

export function instanceOfChangable<T>(object: any): object is IChangable<T> {
  return 'getChangableState' in object
}

export enum SwitcherValue {
  DENOMINATOR = 'DENOMINATOR',
  MULTIPLICATOR = 'MULTIPLICATOR',
  SUMMATOR = 'SUMMATOR',
  DIFFERENCATOR = 'DIFFERENCATOR'
}
