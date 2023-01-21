import { FC, useMemo } from 'react'
import { GAME_MODES } from '../../math/math'
import { GhostPreviewProvider } from '../../hooks/GhostPreview.constate'
import { useGameModeContext } from '../../hooks/GameState.constate'
import { Cube, CubeStates, TCubeState } from '../../components/Cube/Cube'
import { MainMenu } from './MainMenu'

interface MainMenuContainerProps {
  //
}

export const MainMenuContainer: FC<MainMenuContainerProps> = () => {
  const { gameMode } = useGameModeContext()
  const isValidGameMode = useMemo(() => gameMode === GAME_MODES.MAIN_MENU, [gameMode])
  const cubeState = useMemo(
    // () => (isValidGameMode ? CubeStates.opening : CubeStates.hidden) as TCubeState,
    () => (isValidGameMode ? CubeStates.visible : CubeStates.visible) as TCubeState,
    [isValidGameMode]
  )

  return (
    <div
      className='boardParent'
      style={{
        zIndex: cubeState === 'opening' || cubeState === 'visible' ? 1 : 0,
        display: isValidGameMode ? 'block' : 'none'
      }}
    >
      <GhostPreviewProvider>
        <Cube state={cubeState}>
          <MainMenu />
        </Cube>
      </GhostPreviewProvider>
    </div>
  )
}
