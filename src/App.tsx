import { useState } from 'react'

import { Arithmetic } from './components/Arithmetic/Arithmetic'
import { Plotting } from './components/Plotting/Plotting'
import { GAME_MODES } from './math/math'

import './App.css'
import { PlottingProvider } from './components/Plotting/Plotting.constate'

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
        <PlottingProvider>
          <Plotting gameMode={gameMode} setGameMode={setGameMode} />
        </PlottingProvider>
      </div>
    </>
  )
}

export default App
