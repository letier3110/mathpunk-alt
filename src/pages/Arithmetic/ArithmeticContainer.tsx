import { FC, useMemo } from 'react'
import { GAME_MODES } from '../../math/math'
import { GhostPreviewProvider } from '../../hooks/GhostPreview.constate'
import { useGameModeContext } from '../../hooks/GameState.constate'
import { Cube, CubeStates, TCubeState } from '../../components/Cube/Cube'
import { Arithmetic } from './Arithmetic'
import { ChainProvider } from '../../hooks/Chain.constate'

interface ArithmeticContainerProps {
  //
}

export const ArithmeticContainer: FC<ArithmeticContainerProps> = () => {
  const { gameMode } = useGameModeContext()
  const isValidGameMode = useMemo(() => gameMode === GAME_MODES.ARITHMETICS, [gameMode])
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
        <ChainProvider gameMode={GAME_MODES.ARITHMETICS}>
          <Cube state={cubeState}>
            <Arithmetic />
          </Cube>
        </ChainProvider>
      </GhostPreviewProvider>
    </div>
  )
}
