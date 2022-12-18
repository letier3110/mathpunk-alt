import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { InventoryProvider } from './pages/Inventory/Inventory.constate'
import { GameModeProvider } from './shared/GameState.constate'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GameModeProvider>
      <InventoryProvider>
        <App />
      </InventoryProvider>
    </GameModeProvider>
  </React.StrictMode>
)

// todo: add animations - hand collapse, hand draw, mech added flow down
// todo: reserve slot for hand at bottom of first screen
// todo: ?? main menu of game ?? - <nav> [continue, new game] </nav> <content> [patch notes] </content>
//
// todo: taylor series ∞∑n=1−4[(2n−3)!!] 2(2n−3)(2n−1)! as cards
// todo: taylor series as targets
// todo: selectable operator
// todo: only ones mode (1+ 1-)
// todo: map loot
// todo: reroll loot
// todo: arrays of numbers and operators over them (1)
// todo: (1) 🟥 + 🟩 + 🟦 = ?
// todo: (1) convolution operator
// todo: vectors and operations around vector math
// todo: geometry mode?
// todo: playableCards as card's names instead of numbers for first game mode
// todo: irrational targets like √2
// todo: complex targets like √-2 = 2i
