import { FC, useMemo } from 'react'
import { GAME_MODES } from '../../math/math'
import { GhostPreviewProvider } from '../../hooks/GhostPreview.constate'
import { useGameModeContext } from '../../hooks/GameState.constate'
import { Cube, CubeStates, TCubeState } from '../../components/Cube/Cube'
import { Tutorial } from './Tutorial'

interface TutorialContainerProps {
  //
}

export const TutorialContainer: FC<TutorialContainerProps> = () => {
  const { gameMode } = useGameModeContext()
  const isValidGameMode = useMemo(() => gameMode === GAME_MODES.TUTORIAL, [gameMode])
  const state = useMemo(
    // () => (isValidGameMode ? CubeStates.opening : CubeStates.hidden) as TCubeState,
    () => (isValidGameMode ? CubeStates.visible : CubeStates.visible) as TCubeState,
    [isValidGameMode]
  )

  return (
    <div
      className='boardParent'
      style={{
        zIndex: state === 'opening' || state === 'visible' ? 1 : 0,
        display: isValidGameMode ? 'block' : 'none'
      }}
    >
      <GhostPreviewProvider>
        <Cube state={state}>
          <Tutorial />
        </Cube>
      </GhostPreviewProvider>
    </div>
  )
}
