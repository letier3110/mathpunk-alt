import { CSSProperties, FC, useMemo } from 'react'
import { AdditionView } from '../../components/AdditionView/AdditionView'
import { GhostPreview } from '../../components/GhostPreview/GhostPreview'
import { NavigatorTypeView } from '../../components/NavigatorTypeView/NavigatorTypeView'
import { ArithmeticCardTypeEnum, ArithmeticCardTypes } from '../../math/arithmetic'
import { CardType } from '../../math/CardType'
import { ArithmeticCardTypeEnumToClass, GAME_MODES } from '../../math/math'
import { NavigatorCard } from '../../math/NavigatorCard'
import { Numberator } from '../../math/Numberator'
import { NAVIGATION_POWER_NAME, REROLL_POWER_NAME } from '../../shared/decks.data'
import { useGameModeContext } from '../../hooks/GameState.constate'
import { useGhostPreviewContext } from '../../hooks/GhostPreview.constate'

import { useInventoryContext } from './Inventory.constate'

import s from './Inventory.module.css'
import { Reroll } from '../../components/Reroll/Reroll'
import { useRerolls } from '../../hooks/Rerolls.constate'

interface InventoryProps {
  //
}

const arithmeticOperators = Object.values(ArithmeticCardTypes)
const ALL_OPERATORS = arithmeticOperators.map((x) => new ArithmeticCardTypeEnumToClass[x]({ name: '' }))

const MAX_POWER_COUNT = 10

export const Inventory: FC<InventoryProps> = () => {
  const { setGameMode } = useGameModeContext()
  const { mathOperators, powers } = useInventoryContext()
  const { selectedCard, setSelectedCard } = useGhostPreviewContext()
  const { reroll, restoreLeft, left } = useRerolls()

  const handleCardClick = (card: CardType) => {
    if (card.getName() === NAVIGATION_POWER_NAME) {
      restoreLeft()
      setGameMode(GAME_MODES.MAIN_MENU)
      return
    }
    if (card.getName() === REROLL_POWER_NAME) {
      reroll()
      return
    }
  }

  const powersWithBlocked = useMemo(() => {
    return powers.length >= MAX_POWER_COUNT
      ? powers
      : powers.concat(
          Array(MAX_POWER_COUNT - powers.length)
            .fill(0)
            .map(() => new NavigatorCard())
        )
  }, [powers])

  return (
    <div className='secondPage'>
      <div className='secondPageContent'>
        <div className='hps mt32 heading'>Inventory</div>
        <div className={s.sections}>
          <div className={s.section}>
            <div
              className={[selectedCard ? 'border' : '', s.headers].join(' ')}
              style={{
                backgroundColor: selectedCard ? 'rgba(0, 255, 0,.3)' : ''
              }}
              onMouseUp={() => {
                if (selectedCard) {
                  handleCardClick(selectedCard)
                  setSelectedCard(null)
                }
              }}
            >
              Powers
            </div>
            {selectedCard && (
              <GhostPreview
                deck={powers}
                card={selectedCard}
                handleMouseUp={() => {
                  if (selectedCard) {
                    setSelectedCard(null)
                  }
                }}
              />
            )}
            <div
              className={[s.operatorsGrid].join(' ')}
              onMouseUp={() => {
                if (selectedCard) {
                  setSelectedCard(null)
                }
              }}
            >
              {powersWithBlocked.map((x) => {
                const isSelected = x.getId() === selectedCard?.getId()
                const style: CSSProperties = {
                  zIndex: isSelected ? 200 : '',
                  backgroundColor: selectedCard ? 'rgba(0, 255, 0,.3)' : ''
                }
                if (x.getName() === 'Navigator')
                  return (
                    <div key={x.getId()} className='cardPlace'>
                      ?
                    </div>
                  )

                if (x.getName() === REROLL_POWER_NAME) {
                  return (
                    <Reroll
                      key={x.getId()}
                      left={left}
                      style={style}
                      className={[isSelected ? 'border' : '', 'card'].join(' ')}
                      handleReroll={() => {
                        handleCardClick(x)
                      }}
                      handleMouseDown={() => setSelectedCard((prev) => (prev?.getId() === x.getId() ? null : x))}
                    />
                  )
                }
                return (
                  <NavigatorTypeView
                    key={x.getId()}
                    card={x}
                    style={style}
                    isReward
                    className={[isSelected ? 'border' : '', 'card'].join(' ')}
                    handleCardClick={() => {
                      handleCardClick(x)
                    }}
                    handleMouseDown={(card: CardType) =>
                      setSelectedCard((prev) => (prev?.getId() === card.getId() ? null : card))
                    }
                  >
                    <div className='mainText'>{x.getName()}</div>
                  </NavigatorTypeView>
                )
              })}
            </div>
          </div>
          <div className={[s.section, s.operatorsSection].join(' ')}>
            <div className={s.headers}>Math Operators</div>
            <div className={[s.operatorsGrid].join(' ')}>
              {ALL_OPERATORS.map((x, i) => {
                const isInList = mathOperators.indexOf(arithmeticOperators[i])
                return (
                  <AdditionView key={x.getId()} className={s.addition} card={isInList >= 0 ? x : new Numberator()} />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
