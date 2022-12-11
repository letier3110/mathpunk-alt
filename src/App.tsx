import { useState } from 'react'

import { Arithmetic } from './Arithmetic'
import { Plotting } from './Plotting'
import { GAME_MODES } from './math/math'

import './App.css'

function App() {
  const [gameMode, setGameMode] = useState<GAME_MODES>(GAME_MODES.ARITHMETICS)
  return (
    <>
      <div
        style={{
          display: gameMode === GAME_MODES.ARITHMETICS ? 'block' : 'none'
        }}
      >
        <Arithmetic gameMode={gameMode} setGameMode={setGameMode} />
      </div>
      <div
        style={{
          display: gameMode === GAME_MODES.PLOTTING ? 'block' : 'none'
        }}
      >
        <Plotting gameMode={gameMode} setGameMode={setGameMode} />
      </div>
    </>
  )
}

export default App
