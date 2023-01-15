import { CSSProperties, FC, useCallback, useEffect, useRef, useState } from 'react'

import { CardsHand } from '../../components/CardsHand/CardsHand'

import { GAME_MODES, ArithmeticCardTypeEnumToClass } from '../../math/math'
import { useGameModeContext } from '../../hooks/GameState.constate'

import { NavigatorCard } from '../../math/NavigatorCard'
import { NavigatorTypeView } from '../../components/NavigatorTypeView/NavigatorTypeView'
import { MainMenuLoader } from './MainMenuLoader'
import { CardType } from '../../math/CardType'
import { GhostPreview } from '../../components/GhostPreview/GhostPreview'
import { useGhostPreviewContext } from '../../hooks/GhostPreview.constate'
import { ARITHMETIC_NAME, DUEL_NAME, PLOTTING_NAME, REROLL_POWER_NAME, TUTORIAL_NAME } from '../../shared/decks.data'
import { useDeck } from '../../hooks/DeckState.constate'
import { ArithmeticCardTypeEnum, ArithmeticCardTypes } from '../../math/arithmetic'
import { useInventoryContext } from '../Inventory/Inventory.constate'
import { AdditionView } from '../../components/AdditionView/AdditionView'

import s from '../Inventory/Inventory.module.css'

interface MainMenuProps {
  //
}

export const MainMenu: FC<MainMenuProps> = () => {
  const { setGameMode } = useGameModeContext()
  const { mathOperators, powers } = useInventoryContext()
  const [gameModeState, setGameModeState] = useState(GAME_MODES.MAIN_MENU)
  const { getDeck } = useDeck()
  const deck = getDeck(GAME_MODES.MAIN_MENU)
  const { selectedCard, setSelectedCard } = useGhostPreviewContext()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCardClick = useCallback(
    (card: NavigatorCard) => {
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
    },
    [setGameModeState]
  )

  const getRewards = useCallback(
    (
      card: NavigatorCard
    ): {
      powers: Array<CardType>
      operators: Array<CardType>
    } => {
      if (card.getName() === TUTORIAL_NAME) {
        // setGameModeState(GAME_MODES.TUTORIAL)
        return {
          powers: [],
          operators: [
            ArithmeticCardTypes.DENOMINATOR,
            ArithmeticCardTypes.DIFFERENCATOR,
            ArithmeticCardTypes.MULTIPLICATOR,
            ArithmeticCardTypes.SUMMATOR
          ].map((x) => new ArithmeticCardTypeEnumToClass[x]({ name: '' }))
        }
      }
      if (card.getName() === ARITHMETIC_NAME) {
        // setGameModeState(GAME_MODES.ARITHMETICS)
        return {
          powers: [new NavigatorCard(REROLL_POWER_NAME)],
          operators: []
        }
      }
      if (card.getName() === PLOTTING_NAME) {
        // setGameModeState(GAME_MODES.PLOTTING)
        return {
          powers: [],
          operators: []
        }
      }
      if (card.getName() === DUEL_NAME) {
        // setGameModeState(GAME_MODES.DUEL_FUNCTION)
        return {
          powers: [],
          operators: []
        }
      }
      return {
        powers: [],
        operators: []
      }
    },
    [powers, mathOperators]
  )

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
      <div className='flex flex1 aic jcc'>
        <div
          className={[selectedCard ? 'border' : ''].join(' ')}
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
          <MainMenuLoader />
        </div>
      </div>
      {selectedCard && (
        <GhostPreview
          deck={deck}
          card={selectedCard}
          handleMouseUp={() => {
            if (selectedCard) {
              setSelectedCard(null)
            }
          }}
        />
      )}
      <div
        className={[selectedCard ? 'border' : ''].join(' ')}
        style={{
          backgroundColor: selectedCard ? 'rgba(0, 255, 0,.3)' : ''
        }}
        onMouseUp={() => {
          if (selectedCard) {
            setSelectedCard(null)
          }
        }}
      >
        <CardsHand
          className={gameModeState !== GAME_MODES.MAIN_MENU ? 'cardsHide' : ''}
          keys={deck.map((x) => x.getId().toString())}
        >
          {deck.map((x) => {
            const isSelected = x.getId() === selectedCard?.getId()
            const style: CSSProperties = {
              scale: isSelected ? '1.2' : '1',
              zIndex: isSelected ? 200 : '',
              visibility: !isSelected ? 'visible' : 'hidden'
            }
            const name = x.getName()
            const rewards = getRewards(x)
            return (
              <NavigatorTypeView
                key={x.getId()}
                card={x}
                handleCardClick={() => {
                  handleCardClick(x)
                }}
                style={style}
                handleMouseDown={(card: CardType) =>
                  setSelectedCard((prev) => (prev?.getId() === card.getId() ? null : card))
                }
              >
                {rewards.powers.length > 0 && (
                  <div className='cardRewards'>
                    <CardsHand keys={rewards.powers.map((x) => x.getId().toString())}>
                      {rewards.powers.map((x) => {
                        const name = x.getName()
                        return (
                          <NavigatorTypeView key={x.getId()} card={x} isReward>
                            <div className='mainText'>{name}</div>
                          </NavigatorTypeView>
                        )
                      })}
                    </CardsHand>
                  </div>
                )}
                {rewards.operators.length > 0 && (
                  <div className={s.operatorsGridZoomed}>
                    {rewards.operators.map((x) => (
                      <AdditionView key={x.getId()} className={s.addition} card={x} />
                    ))}
                  </div>
                )}
                <div className='mainText'>{name}</div>
              </NavigatorTypeView>
            )
          })}
        </CardsHand>
      </div>
    </div>
  )
}
