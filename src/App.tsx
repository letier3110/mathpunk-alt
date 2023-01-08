import { Arithmetic } from './pages/Arithmetic/Arithmetic'
import { Plotting } from './pages/Plotting/Plotting'
import { Tutorial } from './pages/Tutorial/Tutorial'
import { PlottingProvider } from './pages/Plotting/Plotting.constate'
import { GAME_MODES } from './math/math'

import './App.css'
import { useGameModeContext } from './shared/GameState.constate'
import { Inventory } from './pages/Inventory/Inventory'
import { Duel } from './pages/Duel/Duel'
import { MainMenu } from './pages/MainMenu/MainMenu'
import { GhostPreviewProvider } from './shared/GhostPreview.constate'

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
        <GhostPreviewProvider>
          <Tutorial />
        </GhostPreviewProvider>
      </div>
      {gameMode === GAME_MODES.MAIN_MENU && (
        <div
          style={{
            display: gameMode === GAME_MODES.MAIN_MENU ? 'block' : 'none'
          }}
        >
          <GhostPreviewProvider>
            <MainMenu />
          </GhostPreviewProvider>
        </div>
      )}
      <div
        style={{
          display: gameMode === GAME_MODES.DUEL_FUNCTION ? 'block' : 'none'
        }}
      >
        <GhostPreviewProvider>
          <Duel />
        </GhostPreviewProvider>
      </div>
      <div
        style={{
          display: gameMode === GAME_MODES.ARITHMETICS ? 'block' : 'none'
        }}
      >
        <GhostPreviewProvider>
          <Arithmetic />
        </GhostPreviewProvider>
      </div>
      <div
        style={{
          display: gameMode === GAME_MODES.PLOTTING ? 'block' : 'none'
        }}
      >
        <GhostPreviewProvider>
          <PlottingProvider>
            <Plotting />
          </PlottingProvider>
        </GhostPreviewProvider>
      </div>
      <Inventory />
    </>
  )
}

export default App
