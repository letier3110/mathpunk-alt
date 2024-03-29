import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { InventoryProvider } from './pages/Inventory/Inventory.constate'
import { DeckProvider } from './hooks/DeckState.constate'
import { GameModeProvider } from './hooks/GameState.constate'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GameModeProvider>
      <InventoryProvider>
        <DeckProvider>
          <App />
        </DeckProvider>
      </InventoryProvider>
    </GameModeProvider>
  </React.StrictMode>
)

// Eco
// todo: add links to deployed version
// todo: deploy blog with UPDATES (changelog), TODOS (board), REVIEWS, GOVERN, DONATIONS
// todo: add EVENTS (by comunity, like tournaments), STREAMS (?) to blog
//
// Tech
// todo: triangle fractals using [x1, x2, x3] arrays
// todo: reward for hardmode arithmetic is Switcher
//
// Future Gameplay
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
