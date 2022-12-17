import { DIFFICULTIES, DifficultySettings } from "../../math/math"

export const Y_SIZE = 400
export const Y_SCALE = 10
export const X_SIZE = 400
export const X_SCALE = 10

export const VALUES_PLOTTING: Record<DIFFICULTIES, DifficultySettings> = {
  [DIFFICULTIES.EASY]: {
    minTargetValue: 5,
    maxTargetValue: 15,
    minNumenatorValue: 2,
    maxNumenatorValue: 8,
    preciseness: 80
  },
  [DIFFICULTIES.HARD]: {
    minTargetValue: 2000,
    maxTargetValue: 8000,
    minNumenatorValue: 100,
    maxNumenatorValue: 999,
    preciseness: 25
  }
}
