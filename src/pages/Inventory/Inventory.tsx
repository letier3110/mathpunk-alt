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
import { OperatorCard } from '../../math/OperatorCard'

interface InventoryProps {
  //
}

const arithmeticOperators = Object.values(ArithmeticCardTypes)
const ALL_OPERATORS = arithmeticOperators.map(
  (x) => new ArithmeticCardTypeEnumToClass[x]({ name: '', card: new CardType({ name: '' }) })
)

const MAX_POWER_COUNT = 10

export const Inventory: FC<InventoryProps> = () => {
  const { setGameMode } = useGameModeContext()
  const { mathOperators, powers } = useInventoryContext()
  const { selectedCard, setSelectedCard } = useGhostPreviewContext()
  const { reroll, restoreLeft, left } = useRerolls()

  const handleCardClick = (card: OperatorCard) => {
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
            .map(() => new NavigatorCard({ name: '', card: new CardType({ name: '' }) }))
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
                const isSelected = x.getCard().getId() === selectedCard?.getCard().getId()
                const style: CSSProperties = {
                  zIndex: isSelected ? 200 : '',
                  backgroundColor: selectedCard ? 'rgba(0, 255, 0,.3)' : ''
                }
                if (x.getName() === 'Navigator')
                  return (
                    <div key={x.getCard().getId()} className='cardPlace'>
                      ?
                    </div>
                  )

                if (x.getName() === REROLL_POWER_NAME) {
                  return (
                    <Reroll
                      key={x.getCard().getId()}
                      left={left}
                      style={style}
                      className={[isSelected ? 'border' : '', 'card'].join(' ')}
                      handleReroll={() => {
                        handleCardClick(x)
                      }}
                      handleMouseDown={() =>
                        setSelectedCard((prev) => (prev?.getCard().getId() === x.getCard().getId() ? null : x))
                      }
                    />
                  )
                }
                return (
                  <NavigatorTypeView
                    key={x.getCard().getId()}
                    card={x.getCard() as CardType}
                    style={style}
                    isReward
                    className={[isSelected ? 'border' : '', 'card'].join(' ')}
                    handleCardClick={() => {
                      handleCardClick(x)
                    }}
                    handleMouseDown={() =>
                      setSelectedCard((prev) => (prev?.getCard().getId() === x.getCard().getId() ? null : x))
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
                const cardInlist = x
                const cardNumberator = new Numberator({ name: '', card: new CardType({ name: '' }) })
                const card = isInList >= 0 ? cardInlist : cardNumberator
                return <AdditionView key={x.getCard().getId()} className={s.addition} card={card} />
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
