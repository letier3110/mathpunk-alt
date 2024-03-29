import { CSSProperties, FC, useMemo, useState } from 'react'

import { FormulaeCardType } from '../../math/formulae'
import { formatNumber } from '../../math/utils'
import { FunctionalTypeView } from '../../components/FunctionalTypeView/FunctionalTypeView'
import { X_SIZE, Y_SIZE } from './Plottings.data'
import { useGraph } from './useGraph.hook'

import { NavigatorCard } from '../../math/NavigatorCard'
import { generateTargetPlotting, getDeckPoolPlotting } from './Plotting.utils'
import { CardsHand } from '../../components/CardsHand/CardsHand'
import { CardsChain } from '../../components/CardsChain/CardsChain'
import { useGhostPreviewContext } from '../../hooks/GhostPreview.constate'
import { CardType } from '../../math/CardType'
import { NavigatorTypeView } from '../../components/NavigatorTypeView/NavigatorTypeView'
import { GhostPreview } from '../../components/GhostPreview/GhostPreview'
import { useInventoryContext } from '../Inventory/Inventory.constate'
import { useChainContext } from '../../hooks/Chain.constate'
import { GAME_MODES } from '../../math/math'
import { Cube } from '../../components/Cube/Cube'

interface PlottingProps {
  //
}

interface AddCardProps {
  card: FormulaeCardType
  index?: number
}

const START_NEW_NAME = 'Start new game?'

const lessonEndDeck = [new NavigatorCard(START_NEW_NAME)]

export const Plotting: FC<PlottingProps> = () => {
  const { mathOperators } = useInventoryContext()
  const { selectedCard, setSelectedCard } = useGhostPreviewContext()
  const [hardMode, setHardMode] = useState<boolean>(false)
  const [count, setCount] = useState(generateTargetPlotting())
  // const [left, setLeft] = useState(3)
  const [enemyHp, setEnemyHp] = useState(10)
  const { chain, deck, setDeck, setChain } = useChainContext()

  const equalizerResult: string = useMemo(() => {
    if (chain.length === 0) return '0'
    if (chain.length === 1) return chain[0].getName()
    const strResult = chain.reduce(
      (a, p, i) => a.concat(p.getName().toString(), i === chain.length - 1 ? '' : (p as FormulaeCardType).getAddition().getName()),
      ''
    )
    return strResult
  }, [chain])

  const isGameEnded = enemyHp <= 0

  const {
    prediction,
    targetPlotStr,
    targetLowerPlotStr,
    targetLowerToUpperConnectionStr,
    targetUpperPlotStr,
    targetUpperLowerEndStr,
    playerPlotStr,
    graphConsts,
    setPrediction
  } = useGraph({
    chainLength: chain.length,
    count,
    equalizerResult,
    hardMode
  })

  const handleAddCard = ({ card, index }: AddCardProps) => {
    if (index === undefined) {
      const newArr = chain.concat(card)
      setChain(newArr)
      setDeck(deck.filter((x) => x.getId() !== card.getId()))
    } else {
      const newArr = [...chain.slice(0, index), card, ...chain.slice(index)]
      setChain(newArr)
      setDeck(deck.filter((x) => x.getId() !== card.getId()))
    }
  }

  const handleRemoveCard = ({ card, index }: AddCardProps) => {
    if (!index) {
      const newArr = deck.concat(card)
      setDeck(newArr)
      setChain(chain.filter((x) => x.getId() !== card.getId()))
    } else {
      const newArr = [...deck.slice(0, index), card, ...deck.slice(index)]
      setDeck(newArr)
      setChain(chain.filter((x) => x.getId() !== card.getId()))
    }
  }

  const handleStartNewRound = () => {
    setPrediction(0)
    setCount(generateTargetPlotting())
    // setRound(round + 1)
    setChain([])
    // setLeft(3)
    setDeck(getDeckPoolPlotting({ hardMode, operators: mathOperators }))
  }

  const handleStartNewGame = () => {
    setPrediction(0)
    setCount(generateTargetPlotting())
    // setRound(1)
    setChain([])
    setDeck(getDeckPoolPlotting({ hardMode, operators: mathOperators }))
    setEnemyHp(10)
    // setLeft(3)
  }

  // const handleReroll = () => {
  //   if (left > 0) {
  //     setLeft(left - 1)
  //     setDeck(getDeckPoolPlotting({ hardMode }))
  //   }
  // }

  const handleEqual = () => {
    setSelectedCard(null)
    setEnemyHp(enemyHp + prediction)
    handleStartNewRound()
  }

  const handleEndGameClick = (card: CardType) => {
    if (card.getName() === START_NEW_NAME) {
      handleStartNewGame()
      return
    }
  }

  return (
    <>
      <>
        <div className='hps'>
          <div>
            Remaining points to beat:
            {formatNumber(enemyHp)}
            {prediction !== 0 && chain.length > 0 && (
              <span style={{ color: prediction > 0 ? '#ff0000' : '#00aa00' }}>
                {' '}
                {prediction !== 0 ? `(${prediction > 0 ? '+' : ''}${prediction})` : ''}
              </span>
            )}
          </div>
        </div>
        {isGameEnded === false && (
          <>
            <div
              className={[chain.length === 0 && selectedCard ? 'border' : '', 'plot flex1 mb32'].join(' ')}
              style={{
                backgroundColor: chain.length === 0 && selectedCard ? 'rgba(0, 255, 0,.3)' : '',
                minHeight: '100px',
                minWidth: '100px'
              }}
              onMouseUp={() => {
                if (chain.length === 0 && selectedCard) {
                  handleAddCard({ card: selectedCard as FormulaeCardType })
                  setSelectedCard(null)
                }
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox={`0 0 ${X_SIZE} ${Y_SIZE}`}
                stroke='currentColor'
                strokeWidth={1}
              >
                <path
                  strokeLinecap='round'
                  strokeWidth={1}
                  strokeOpacity={0.5}
                  strokeLinejoin='round'
                  d={graphConsts.join(' ')}
                />
                <path strokeLinecap='round' stroke='#00aa00' opacity={0.5} strokeLinejoin='round' d={targetPlotStr} />
                <path
                  stroke='transparent'
                  fill='#00ff00'
                  opacity={0.3}
                  d={targetLowerPlotStr + targetLowerToUpperConnectionStr + targetUpperPlotStr + targetUpperLowerEndStr}
                />
                {chain.length > 0 && (
                  <path stroke='#0000ff' strokeLinecap='round' strokeLinejoin='round' d={playerPlotStr} />
                )}
              </svg>
            </div>
            <CardsChain
              chain={chain}
              keys={chain.map((x) => x.getId().toString())}
              equalizerResult={equalizerResult}
              handleEqual={handleEqual}
            >
              {chain.map((x, i) => (
                <FunctionalTypeView
                  key={x.getId()}
                  card={x as FormulaeCardType}
                  showPreview
                  className='card noAddition'
                  isHoverable={selectedCard !== null}
                  handleMouseUpBefore={() => {
                    if (selectedCard) {
                      handleAddCard({ card: selectedCard as FormulaeCardType, index: i })
                      setSelectedCard(null)
                    }
                  }}
                  handleMouseUpAfter={() => {
                    if (selectedCard) {
                      handleAddCard({ card: selectedCard as FormulaeCardType, index: i + 1 })
                      setSelectedCard(null)
                    }
                  }}
                  handleMouseDown={(card: FormulaeCardType) => {
                    handleRemoveCard({ card })
                    setSelectedCard((prev) => (prev?.getId() === card.getId() ? null : card))
                  }}
                />
              ))}
            </CardsChain>
            {selectedCard && (
              <GhostPreview
                deck={deck}
                card={selectedCard}
                showField={'name'}
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
                backgroundColor: selectedCard ? 'rgba(0, 255, 0,.3)' : '',
                padding: '0px 40px'
              }}
              onMouseUp={() => {
                if (selectedCard) {
                  setSelectedCard(null)
                }
              }}
            >
              <CardsHand keys={deck.map((x) => x.getId().toString())}>
                {deck.map((x) => {
                  const isSelected = x.getId().toString() === selectedCard?.getId().toString()
                  const style: CSSProperties = {
                    scale: isSelected ? '1.2' : '1',
                    zIndex: isSelected ? 200 : '',
                    visibility: !isSelected ? 'visible' : 'hidden'
                  }
                  return (
                    <FunctionalTypeView
                      key={x.getId().toString()}
                      card={x as FormulaeCardType}
                      style={style}
                      handleCardClick={() => handleAddCard({ card: x as FormulaeCardType })}
                      handleMouseDown={(card: CardType) =>
                        setSelectedCard((prev) => (prev?.getId().toString() === card.getId().toString() ? null : card))
                      }
                    />
                  )
                })}
              </CardsHand>
            </div>
          </>
        )}
        {isGameEnded === true && (
          <>
            <div
              className={[selectedCard ? 'border' : '', 'win'].join(' ')}
              style={{
                backgroundColor: selectedCard ? 'rgba(0, 255, 0,.3)' : ''
              }}
              onMouseUp={() => {
                if (selectedCard) {
                  handleEndGameClick(selectedCard)
                  setSelectedCard(null)
                }
              }}
            >
              <div>🥳🥳🥳</div>
              <div>You won!</div>
              <div>
                Hard mode?
                <input type='checkbox' checked={hardMode} onChange={(e) => setHardMode(e.target.checked)} />
              </div>
            </div>
            {selectedCard && (
              <GhostPreview
                deck={lessonEndDeck}
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
              <CardsHand keys={lessonEndDeck.map((x) => x.getId().toString())}>
                {lessonEndDeck.map((x) => {
                  const isSelected = x.getId().toString() === selectedCard?.getId().toString()
                  const style: CSSProperties = {
                    scale: isSelected ? '1.2' : '1',
                    zIndex: isSelected ? 200 : '',
                    visibility: !isSelected ? 'visible' : 'hidden'
                  }
                  return (
                    <NavigatorTypeView
                      key={x.getId().toString()}
                      card={x}
                      handleCardClick={() => {
                        handleEndGameClick(x)
                      }}
                      style={style}
                      handleMouseDown={(card: CardType) =>
                        setSelectedCard((prev) => (prev?.getId().toString() === card.getId().toString() ? null : card))
                      }
                    >
                      <div className='mainText'>{x.getName()}</div>
                    </NavigatorTypeView>
                  )
                })}
              </CardsHand>
            </div>
          </>
        )}
      </>
    </>
  )
}
