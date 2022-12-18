import constate from "constate";
import { useState } from "react";
import { FormulaeCardType } from "../../math/formulae";
import { getDeckPoolPlotting } from "./Plotting.utils";

// 2️⃣ Wrap your hook with the constate factory
export const [PlottingProvider, usePlottingContext] = constate(() => {
  const [chain, setChain] = useState<FormulaeCardType[]>([])
  const [deck, setDeck] = useState<FormulaeCardType[]>(getDeckPoolPlotting({}))
  return { 
    chain,
    deck,
    setChain,
    setDeck
   };
});