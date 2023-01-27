import { CardType } from '../math/CardType'
import { NavigatorCard } from '../math/NavigatorCard'
import { getMathOperatorsItem, getPowersItem } from '../pages/Inventory/Inventory.storage'

export const TUTORIAL_NAME = 'Start Tutorial?'
export const ARITHMETIC_NAME = 'Start Arithmetic?'
export const PLOTTING_NAME = 'Start Plotting?'
export const DUEL_NAME = 'Start Duel?'
export const DRINKS_NAME = 'Some drinks?'
export const EQUATIONS_NAME = 'Maybe equations?'

export const mainMenuDeck = [
  // new Navigator('Continue')
  new NavigatorCard({ name: TUTORIAL_NAME, card: new CardType({ name: '' }) }),
  new NavigatorCard({ name: ARITHMETIC_NAME, card: new CardType({ name: '' }) }),
  new NavigatorCard({ name: PLOTTING_NAME, card: new CardType({ name: '' }) }),
  new NavigatorCard({ name: DUEL_NAME, card: new CardType({ name: '' }) }),
  new NavigatorCard({ name: DRINKS_NAME, card: new CardType({ name: '' }) }),
  new NavigatorCard({ name: EQUATIONS_NAME, card: new CardType({ name: '' }) })
]

export const RESTART_TUTORIAL_NAME = 'Restart tutorial?'
export const CONTINUE_NAME = 'Continue to actual gameplay?'

export const gameOverDeck = [
  // new Navigator('Continue')
  new NavigatorCard({ name: RESTART_TUTORIAL_NAME, card: new CardType({ name: '' }) }),
  new NavigatorCard({ name: CONTINUE_NAME, card: new CardType({ name: '' }) })
]

export const START_AGAIN_NAME = 'Start tutorial again?'
export const CONTINUE_LESSON_NAME = 'Continue to next lesson?'
export const SKIP_NAME = 'Skip?'

export const lessonEndDeck = [
  new NavigatorCard({ name: START_AGAIN_NAME, card: new CardType({ name: '' }) }),
  new NavigatorCard({ name: CONTINUE_LESSON_NAME, card: new CardType({ name: '' }) }),
  new NavigatorCard({ name: SKIP_NAME, card: new CardType({ name: '' }) })
]

export const NAVIGATION_POWER_NAME = 'To Bar'
export const LOAD_SAVES_NAME = 'Restore your last journey'
export const REROLL_POWER_NAME = 'Recieve Reroll power'

const isSavesPresent = getPowersItem().length > 0 || getMathOperatorsItem().length > 0

export const introDeck = [new NavigatorCard({ name: NAVIGATION_POWER_NAME, card: new CardType({ name: '' }) })].concat(
  isSavesPresent ? [new NavigatorCard({ name: LOAD_SAVES_NAME, card: new CardType({ name: '' }) })] : []
)

export const arithmeticWinDeck = [new NavigatorCard({ name: REROLL_POWER_NAME, card: new CardType({ name: '' }) })]
