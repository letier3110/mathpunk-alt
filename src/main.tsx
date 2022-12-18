import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { GameModeProvider } from './shared/GameState.constate'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GameModeProvider>
    <App />
    </GameModeProvider>
  </React.StrictMode>
)

// todo: tutorial - introduce to player + - * / and give him this mechs
// todo: implement second hand, that will be under the table
// todo: implement inventory, the will be under second hand
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
