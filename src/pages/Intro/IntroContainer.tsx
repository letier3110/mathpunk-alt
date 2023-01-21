import { FC, useMemo } from 'react'
import { GAME_MODES } from '../../math/math'
import { GhostPreviewProvider } from '../../hooks/GhostPreview.constate'
import { useGameModeContext } from '../../hooks/GameState.constate'
import { Cube, CubeStates, TCubeState } from '../../components/Cube/Cube'
import { Intro } from './Intro'

interface IntroContainerProps {
  //
}

export const IntroContainer: FC<IntroContainerProps> = () => {
  const { gameMode } = useGameModeContext()
  const isValidGameMode = useMemo(() => gameMode === GAME_MODES.INTRO, [gameMode])
  const cubeState = useMemo(
    () => (isValidGameMode ? CubeStates.opening : CubeStates.closing) as TCubeState,
    // () => (isValidGameMode ? CubeStates.visible : CubeStates.visible) as TCubeState,
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
          <Intro />
        </Cube>
      </GhostPreviewProvider>
    </div>
  )
}
