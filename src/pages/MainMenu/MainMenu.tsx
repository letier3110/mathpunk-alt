import { FC, useEffect, useRef, useState, CSSProperties } from 'react'
import type { DropTargetMonitor, XYCoord } from 'react-dnd'
import { useDragLayer } from 'react-dnd'

import { CardsHand } from '../../components/CardsHand/CardsHand'

import { GAME_MODES } from '../../math/math'
import { useGameModeContext } from '../../shared/GameState.constate'

import { Navigator } from '../../math/Navigator'
import { NavigatorTypeView } from '../../components/NavigatorTypeView/NavigatorTypeView'
import { MainMenuLoader } from './MainMenuLoader'
import { useDrop } from 'react-dnd'
import { ItemTypes } from '../../shared/constants'
import { CardType } from '../../math/arithmetic'

interface MainMenuProps {
  //
}

const TUTORIAL_NAME = 'Start Tutorial?'
const ARITHMETIC_NAME = 'Start Arithmetic?'
const PLOTTING_NAME = 'Start Plotting?'
const DUEL_NAME = 'Start Duel?'

export const MainMenu: FC<MainMenuProps> = () => {
  const { setGameMode } = useGameModeContext()
  const [gameModeState, setGameModeState] = useState(GAME_MODES.MAIN_MENU)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const deck = [
    // new Navigator('Continue')
    new Navigator(TUTORIAL_NAME),
    new Navigator(ARITHMETIC_NAME),
    new Navigator(PLOTTING_NAME),
    new Navigator(DUEL_NAME)
  ]

  const canDropHandle = () => {
    return true
  }

  const dropHandle = (e: CardType) => {
    // game.moveKnight(x, y)
    console.log('dropped something', e)
  }

  const collectHandle = (monitor: DropTargetMonitor) => ({
    isOver: !!monitor.isOver(),
    canDrop: !!monitor.canDrop()
  })

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      canDrop: canDropHandle,
      drop: dropHandle,
      collect: collectHandle
    }),
    []
  )

  const handleCardClick = (card: Navigator) => {
    if (card.getName() === TUTORIAL_NAME) {
      setGameModeState(GAME_MODES.TUTORIAL)
      return
    }
    if (card.getName() === ARITHMETIC_NAME) {
      setGameModeState(GAME_MODES.ARITHMETICS)
      return
    }
    if (card.getName() === PLOTTING_NAME) {
      setGameModeState(GAME_MODES.PLOTTING)
      return
    }
    if (card.getName() === DUEL_NAME) {
      setGameModeState(GAME_MODES.DUEL_FUNCTION)
      return
    }
  }

  useEffect(() => {
    if (gameModeState !== GAME_MODES.MAIN_MENU) {
      timerRef.current = setTimeout(() => {
        setGameMode(gameModeState)
      }, 1100)
    }
    return () => {
      if (timerRef && timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [gameModeState])

  return (
    <div className='root'>
      <div
        style={{
          background: !isOver && canDrop ? '#fa5' : ''
        }}
        role='Space'
        ref={drop}
        className='flex flex1 aic jcc'
      >
        <MainMenuLoader />
      </div>
      {/* <CustomDragLayer snapToGrid={false} /> */}
      <CardsHand
        className={gameModeState !== GAME_MODES.MAIN_MENU ? 'cardsHide' : ''}
        keys={deck.map((x) => x.getId().toString())}
      >
        {deck.map((x) => (
          <NavigatorTypeView
            key={x.getId()}
            card={x}
            handleCardClick={() => {
              handleCardClick(x)
            }}
          />
        ))}
      </CardsHand>
    </div>
  )
}

const layerStyles: CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
}

function getItemStyles(initialOffset: XYCoord | null, currentOffset: XYCoord | null, isSnapToGrid: boolean) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    }
  }

  let { x, y } = currentOffset

  if (isSnapToGrid) {
    x -= initialOffset.x
    y -= initialOffset.y
    ;[x, y] = snapToGrid(x, y)
    x += initialOffset.x
    y += initialOffset.y
  }

  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform
  }
}

export interface CustomDragLayerProps {
  snapToGrid: boolean
}

export const CustomDragLayer: FC<CustomDragLayerProps> = (props) => {
  const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }))

  function renderItem() {
    console.log(item, itemType)
    switch (itemType) {
      case ItemTypes.CARD:
        return <NavigatorTypeView key={item.getId()} card={item} handleCardClick={() => {}} />
      default:
        return null
    }
  }

  if (!isDragging) {
    return null
  }
  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset, props.snapToGrid)}>{renderItem()}</div>
    </div>
  )
}

export function snapToGrid(x: number, y: number): [number, number] {
  const snappedX = Math.round(x / 32) * 32
  const snappedY = Math.round(y / 32) * 32
  return [snappedX, snappedY]
}
