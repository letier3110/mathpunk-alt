import { ArithmeticCardTypeEnum, ArithmeticCardTypes } from "../../math/arithmetic"
import { CardType } from "../../math/CardType"
import { Numberator } from "../../math/Numberator"

export interface TutorialEntity {
  target: number
  maxChain: number
  cards: CardType[]
  chain: CardType[]
}

export interface TutorialSetup {
  name: ArithmeticCardTypeEnum
  tutorials: TutorialEntity[]
}

export const summatorTutorials: TutorialEntity[] = [
  {
    target: 4,
    maxChain: 2,
    cards: [new Numberator(1), new Numberator(2), new Numberator(3)],
    chain: []
  },
  {
    target: 6,
    maxChain: 2,
    cards: [new Numberator(1), new Numberator(2), new Numberator(3), new Numberator(4)],
    chain: []
  },
  {
    target: 10,
    maxChain: 3,
    cards: [new Numberator(1), new Numberator(2), new Numberator(3), new Numberator(5)],
    chain: []
  },
  {
    target: 50,
    maxChain: 3,
    cards: [new Numberator(12), new Numberator(23), new Numberator(18), new Numberator(15), new Numberator(15)],
    chain: []
  }
]

export const differencatorTutorials: TutorialEntity[] = [
  {
    target: 1,
    maxChain: 2,
    cards: [new Numberator(5), new Numberator(2), new Numberator(3), new Numberator(4)],
    chain: []
  },
  {
    target: 5,
    maxChain: 2,
    cards: [new Numberator(7), new Numberator(17), new Numberator(21), new Numberator(12)],
    chain: []
  },
  {
    target: 2,
    maxChain: 2,
    cards: [new Numberator(19), new Numberator(31), new Numberator(-5), new Numberator(-7)],
    chain: []
  },
  {
    target: 50,
    maxChain: 2,
    cards: [new Numberator(12), new Numberator(-23), new Numberator(-18), new Numberator(55), new Numberator(5)],
    chain: []
  }
]

export const multiplicatorTutorials: TutorialEntity[] = [
  {
    target: 10,
    maxChain: 2,
    cards: [new Numberator(5), new Numberator(2), new Numberator(3), new Numberator(4)],
    chain: []
  },
  {
    target: 21 * 17,
    maxChain: 2,
    cards: [new Numberator(7), new Numberator(17), new Numberator(21), new Numberator(12)],
    chain: []
  },
  {
    target: -5 * 31 * 19,
    maxChain: 3,
    cards: [new Numberator(19), new Numberator(31), new Numberator(-5), new Numberator(-7)],
    chain: []
  },
  {
    target: -32 * -18,
    maxChain: 2,
    cards: [new Numberator(-32), new Numberator(-23), new Numberator(-18), new Numberator(55), new Numberator(5)],
    chain: []
  }
]

export const denominatorTutorials: TutorialEntity[] = [
  {
    target: 5 / 2,
    maxChain: 2,
    cards: [new Numberator(5), new Numberator(2), new Numberator(3), new Numberator(4)],
    chain: []
  },
  {
    target: 17 / 21,
    maxChain: 2,
    cards: [new Numberator(7), new Numberator(17), new Numberator(21), new Numberator(12)],
    chain: []
  },
  {
    target: -7 / 19 / 31,
    maxChain: 3,
    cards: [new Numberator(19), new Numberator(31), new Numberator(-5), new Numberator(-7)],
    chain: []
  },
  {
    target: -23 / -18,
    maxChain: 2,
    cards: [new Numberator(12), new Numberator(-23), new Numberator(-18), new Numberator(55), new Numberator(5)],
    chain: []
  }
]

export const tutorialSeries: TutorialSetup[] = [
  {
    name: ArithmeticCardTypes.SUMMATOR,
    tutorials: summatorTutorials
  },
  {
    name: ArithmeticCardTypes.DIFFERENCATOR,
    tutorials: differencatorTutorials
  },
  {
    name: ArithmeticCardTypes.MULTIPLICATOR,
    tutorials: multiplicatorTutorials
  },
  {
    name: ArithmeticCardTypes.DENOMINATOR,
    tutorials: denominatorTutorials
  }
]

export const INITIAL_CHAIN: CardType[] = tutorialSeries[0].tutorials[0].chain
export const INITIAL_DECK: CardType[] = tutorialSeries[0].tutorials[0].cards
export const INITIAL_ENEMY_HP = 10
export const targetEnemyHp = 0