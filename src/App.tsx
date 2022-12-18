import { useState } from 'react'

import { Arithmetic } from './pages/Arithmetic/Arithmetic'
import { Plotting } from './pages/Plotting/Plotting'
import { Tutorial } from './pages/Tutorial/Tutorial'
import { PlottingProvider } from './pages/Plotting/Plotting.constate'
import { GAME_MODES } from './math/math'

import './App.css'
import { useGameModeContext } from './shared/GameState.constate'
import { Inventory } from './pages/Inventory/Inventory'

function App() {
  const { gameMode } = useGameModeContext()
  // const [gameMode, setGameMode] = useState<GAME_MODES>(GAME_MODES.ARITHMETICS)
  // const [tutorial, setTutorial] = useState(true)
  return (
    <>
      <div
        style={{
          display: gameMode === GAME_MODES.TUTORIAL ? 'block' : 'none'
        }}
      >
        <Tutorial />
      </div>
      <div
        style={{
          display: gameMode === GAME_MODES.ARITHMETICS ? 'block' : 'none'
        }}
      >
        <Arithmetic />
      </div>
      <div
        style={{
          display: gameMode === GAME_MODES.PLOTTING ? 'block' : 'none'
        }}
      >
        <PlottingProvider>
          <Plotting />
        </PlottingProvider>
      </div>
      <Inventory />
    </>
  )
}

export default App
