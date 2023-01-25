import { FC, useMemo } from 'react'
import { GAME_MODES } from '../../math/math'
import { GhostPreviewProvider } from '../../hooks/GhostPreview.constate'
import { useGameModeContext } from '../../hooks/GameState.constate'
import { Cube, CubeStates, TCubeState } from '../../components/Cube/Cube'
import { Drinks } from './Drinks'
import { ChainProvider } from '../../hooks/Chain.constate'

interface DrinksContainerProps {
  //
}

export const DrinksContainer: FC<DrinksContainerProps> = () => {
  const { gameMode } = useGameModeContext()
  const isValidGameMode = useMemo(() => gameMode === GAME_MODES.DRINKS, [gameMode])
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
        <ChainProvider gameMode={GAME_MODES.DRINKS}>
          <Cube state={cubeState}>
            <Drinks />
          </Cube>
        </ChainProvider>
      </GhostPreviewProvider>
    </div>
  )
}
