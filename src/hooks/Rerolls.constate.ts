import constate from "constate";
import { useState } from "react";
import { ArithmeticCardTypeEnum } from "../math/arithmetic";
import { CardType } from "../math/CardType";
import { useDeck } from "./DeckState.constate";
import { useGameModeContext } from "./GameState.constate";

interface RerollsValues {
  left: number;
  setLeft: (l: number) => void;
  restoreLeft: () => void;
  reroll: () => void;
}

const INITIAL_VALUE = 3

// 2️⃣ Wrap your hook with the constate factory
export const [RerollsProvider, useRerolls] = constate((): RerollsValues => {
  const { refreshDeck } = useDeck()
  const { gameMode } = useGameModeContext()
  const [left, setLeft] = useState(INITIAL_VALUE)

  const reroll = () => {
    if(left === 0) return;
    refreshDeck(gameMode)
    setLeft(left - 1)
  }

  return { 
    left,
    setLeft,
    restoreLeft: () => setLeft(INITIAL_VALUE),
    reroll
   };
});