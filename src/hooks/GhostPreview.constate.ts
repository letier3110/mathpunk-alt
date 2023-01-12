import constate from "constate";
import { useState } from "react";
import { CardType } from "../math/CardType";

// 2️⃣ Wrap your hook with the constate factory
export const [GhostPreviewProvider, useGhostPreviewContext] = constate(() => {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null)
  return { 
    selectedCard,
    setSelectedCard
   };
});