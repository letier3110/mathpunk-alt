import constate from "constate";
import { useState } from "react";
import { GAME_MODES } from "../math/math";

// const initialGameplay: GAME_MODES = GAME_MODES.TUTORIAL
// const initialGameplay: GAME_MODES = GAME_MODES.DUEL_FUNCTION
const initialGameplay: GAME_MODES = GAME_MODES.MAIN_MENU

export const [GameModeProvider, useGameModeContext] = constate(() => {
  const [gameMode, setGameMode] = useState<GAME_MODES>(initialGameplay)
  return { 
    gameMode,
    setGameMode
   };
});