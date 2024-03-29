import { NavigatorCard } from '../math/NavigatorCard'
import { getMathOperatorsItem, getPowersItem } from '../pages/Inventory/Inventory.storage'

export const TUTORIAL_NAME = 'Start Tutorial?'
export const ARITHMETIC_NAME = 'Start Arithmetic?'
export const PLOTTING_NAME = 'Start Plotting?'
export const DUEL_NAME = 'Start Duel?'

export const mainMenuDeck = [
  // new Navigator('Continue')
  new NavigatorCard(TUTORIAL_NAME),
  new NavigatorCard(ARITHMETIC_NAME),
  new NavigatorCard(PLOTTING_NAME),
  new NavigatorCard(DUEL_NAME)
]

export const RESTART_TUTORIAL_NAME = 'Restart tutorial?'
export const CONTINUE_NAME = 'Continue to actual gameplay?'

export const gameOverDeck = [
  // new Navigator('Continue')
  new NavigatorCard(RESTART_TUTORIAL_NAME),
  new NavigatorCard(CONTINUE_NAME)
]

export const START_AGAIN_NAME = 'Start tutorial again?'
export const CONTINUE_LESSON_NAME = 'Continue to next lesson?'
export const SKIP_NAME = 'Skip?'

export const lessonEndDeck = [
  new NavigatorCard(START_AGAIN_NAME),
  new NavigatorCard(CONTINUE_LESSON_NAME),
  new NavigatorCard(SKIP_NAME)
]

export const NAVIGATION_POWER_NAME = 'To Bar'
export const LOAD_SAVES_NAME = 'Restore your last journey'
export const REROLL_POWER_NAME = 'Recieve Reroll power'

const isSavesPresent = getPowersItem().length > 0 || getMathOperatorsItem().length > 0

export const introDeck = [new NavigatorCard(NAVIGATION_POWER_NAME)].concat(
  isSavesPresent ? [new NavigatorCard(LOAD_SAVES_NAME)] : []
)

export const arithmeticWinDeck = [new NavigatorCard(REROLL_POWER_NAME)]
