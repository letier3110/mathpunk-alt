import constate from "constate";
import { useState } from "react";
import { GAME_MODES } from "../math/math";

const initialGameplay: GAME_MODES = GAME_MODES.PLOTTING

// 2️⃣ Wrap your hook with the constate factory
export const [GameModeProvider, useGameModeContext] = constate(() => {
  const [gameMode, setGameMode] = useState<GAME_MODES>(initialGameplay)
  return { 
    gameMode,
    setGameMode
   };
});