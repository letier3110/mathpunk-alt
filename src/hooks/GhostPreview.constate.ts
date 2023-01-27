import constate from "constate";
import { useState } from "react";
import { CardType } from "../math/CardType";
import { OperatorCard } from "../math/OperatorCard";
import { VectorCard } from "../math/VectorCard";

// 2️⃣ Wrap your hook with the constate factory
export const [GhostPreviewProvider, useGhostPreviewContext] = constate(() => {
  const [selectedCard, setSelectedCard] = useState<OperatorCard | null>(null)
  return { 
    selectedCard,
    setSelectedCard
   };
});