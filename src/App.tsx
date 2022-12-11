import { useState } from 'react'

import { Arithmetic } from './Arithmetic'
import { GAME_MODES } from './math/math'

import './App.css'

function App() {
  const [gameMode, setGameMode] = useState<GAME_MODES>(GAME_MODES.ARITHMETICS)
  return (
    <>
      {gameMode === GAME_MODES.ARITHMETICS && <Arithmetic gameMode={gameMode} setGameMode={setGameMode} />}
      {/* {gameMode === GAME_MODES.ARITHMETICS && (<Arithmetic />)} */}
    </>
  )
}

export default App
