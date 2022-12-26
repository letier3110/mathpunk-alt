import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { InventoryProvider } from './pages/Inventory/Inventory.constate'
import { GameModeProvider } from './shared/GameState.constate'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <GameModeProvider>
        <InventoryProvider>
          <App />
        </InventoryProvider>
      </GameModeProvider>
    </DndProvider>
  </React.StrictMode>
)

// Eco
// todo: add links to deployed version
// todo: deploy blog with UPDATES (changelog), TODOS (board), REVIEWS, GOVERN, DONATIONS
// todo: add EVENTS (by comunity, like tournaments), STREAMS (?) to blog
//
// Tech
// todo: triangle fractals using [x1, x2, x3] arrays
// todo: reward for arithmetic is Switcher
// todo: reward for hardmode arithmetic is Rerolls
// todo: add animations - hand collapse, hand draw, mech added flow down
// todo: reserve slot for hand at bottom of first screen
// todo: ?? main menu of game ?? - <nav> [continue, new game] </nav> <content> [patch notes] </content>
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
